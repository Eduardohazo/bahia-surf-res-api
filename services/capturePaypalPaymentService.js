import axios from "axios";
import connectDB from "../services/db.service.js";
import { ObjectId } from "mongodb";
import { AppError } from "../errors/AppError.js";
import { RequestStatus } from "../enums/RequestStatus.js";

const BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await axios.post(
    `${BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return res.data.access_token;
};

export const capturePaypalPaymentService = async (data) => {
  const { paypalOrderId, mongoOrderId } = data; // Destructuring outside try
  const token = await getAccessToken();
  const db = await connectDB();

  // 1. Initial validation
  if (!paypalOrderId || !mongoOrderId) {
    throw new AppError(400, RequestStatus.responsePhase.VALIDATION_ERROR, "Missing required IDs");
  }

  try {
    // 2. Capture on Paypal (Critic Point 1)
    const res = await axios.post(
      `${BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Analizing paypal status
    if (res.data.status !== "COMPLETED") {
      throw new AppError(
        400, 
        RequestStatus.responsePhase.ERROR, 
        `PayPal status: ${res.data.status}`
      );
    }

    // 3. DB Updates (Critic Point 1: Money has already been taken)
    try {
      const mongoPaidOrder = await db.collection("orders").updateOne(
        { _id: new ObjectId(mongoOrderId) },
        {
          $set: {
            status: "PAID",
            paypalOrderId: paypalOrderId,
            capturedAt: new Date(),
          },
        }
      );
      console.log("MONGO PAID ORDER",mongoPaidOrder);
      return mongoPaidOrder;

    } catch (dbError) {
      // We get here if payment successfull but no registered payment on mongo db order...
      // TODO: SOLUTION for payment done but register failed. Implement: La "Red de Seguridad" Inmediata (Webhooks)
      console.error("!!! CRITICAL: Payment captured but DB update failed", {
        paypalId: paypalOrderId,
        mongoId: mongoOrderId,
        error: dbError.message
      });
      
      throw new AppError(
        500,
        RequestStatus.responsePhase.DATA_CORRUPTION,
        "Payment confirmed but record failed. Save your PayPal ID."
      );
    }

  } catch (error) {
    // 4. Exceptions handling (Propagation)
    
    // Si el error ya es un AppError (lanzado por nosotros), lo dejamos pasar tal cual
    if (error instanceof AppError) throw error;

    // Si es un error de Axios (infraestructura de PayPal)
    if (error.isAxiosError) {
      throw new AppError(
        502, // Bad Gateway
        RequestStatus.responsePhase.SERVER_ERROR,
        "PayPal communication failed during capture"
      );
    }

    // Any other unexpected error
    throw error; 
  }
};
