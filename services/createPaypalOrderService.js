import axios from "axios";
import { AppError } from "../errors/AppError.js";
import { getOrderService } from "./getOrderService.js";
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

export const createPaypalOrderService = async (data) => {
  const order = await getOrderService(data.orderId);

  const token = await getAccessToken();

  // Calculate total from the DB items to ensure price integrity
  const total = order.items.reduce((sum, item) => sum + Number(item.price), 0);

  const cancelUrl = `http://localhost:5173/paymentCancel?orderId=${encodeURIComponent(order._id)}&customOrderId=${encodeURIComponent(order.id_order)}`;
  const returnUrl = `http://localhost:5173/paymentSuccess?orderId=${encodeURIComponent(order._id)}&customOrderId=${encodeURIComponent(order.id_order)}`;

  // Paypal object rquired to create Paypal order
  const orderPayload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: order.id_order, // Using your custom "ORD-..." ID
        description: `Payment for Order ${order.id_order}`,
        amount: {
          currency_code: "USD",
          value: total.toFixed(2), // Now it's a guaranteed number from DB
        },
      },
    ],
    application_context: {
      brand_name: "Bahía",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      shipping_preference: "NO_SHIPPING",
      // Pass the DB _id to the return URL so your success page can find it
      return_url: returnUrl, // URL protegida
      cancel_url: cancelUrl, // URL protegida
    },
  };

  try {
    const res = await axios.post(`${BASE}/v2/checkout/orders`, orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const approvalUrl = res.data.links.find(
      (link) => link.rel === "approve",
    )?.href;

    return {
      paypalOrderId: res.data.id,
      approvalUrl,
    };
  } catch (error) {
    throw new AppError(
      503,
      RequestStatus.responsePhase.SERVER_ERROR,
      "PayPal infrastructure is down",
    );
  }
};
