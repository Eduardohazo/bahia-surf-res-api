import asyncHandler from "express-async-handler";
import { createPaypalOrderService } from "../services/createPaypalOrderService.js";
import { capturePaypalPaymentService } from "../services/capturePaypalPaymentService.js";
import { sendResponse } from "../utils/responseHandler.js";
import { RequestStatus } from "../enums/RequestStatus.js";
import { sanitize } from "../utils/sanitizer.js";

export const createPaymentOrderController = asyncHandler(async (req, res) => {
  const data = sanitize(req.body);
  console.log("data request",data);
  const paypalResponse = await createPaypalOrderService(data);

  return sendResponse(
    res,
    201,
    RequestStatus.responsePhase.SUCCESS,
    "Paypal Order created",
    paypalResponse
  );
});

export const capturePaymentController = asyncHandler(async (req, res) => {
  const data = sanitize(req.body);
  const capturedPayment = await capturePaypalPaymentService(data);

  return sendResponse(
    res,
    200,
    RequestStatus.responsePhase.SUCCESS,
    "Payment successful and order updated!",
    capturedPayment
  );
});
