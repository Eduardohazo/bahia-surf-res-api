import asyncHandler from "express-async-handler";
import { getAllOrders } from "../services/getAllOrdersService.js";
import { createOrderService } from "../services/createOrderService.js";
import { getOrderService } from "../services/getOrderService.js";
import { sanitize } from "../utils/sanitizer.js";
import { cleanupExpiredOrdersService } from "../services/cleanupExpiredOrdersService.js";
import { sendResponse } from "../utils/responseHandler.js";
import { RequestStatus } from "../enums/RequestStatus.js";

// CREATE
export const createOrderController = asyncHandler(async (req, res) => {
  await cleanupExpiredOrdersService();
  const data = sanitize(req.body);
  const order = await createOrderService(data);

  return sendResponse(
    res,
    201,
    RequestStatus.responsePhase.SUCCESS,
    "Order created",
    order,
  );
});

// READ
export const getOrderController = asyncHandler(async (req, res) => {
  let id = req.params.id;
  const sanitizedId = sanitize(id);

  // Get order by id
  const order = await getOrderService(sanitizedId);

  return sendResponse(
    res,
    200,
    RequestStatus.responsePhase.SUCCESS,
    `Order ${order.id_order} fetched`,
    order,
  );
});

// READ
export const getAllOrdersController = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();

  return sendResponse(
    res,
    200,
    RequestStatus.responsePhase.SUCCESS,
    "All orders fetched successfully",
    orders,
  );
});
