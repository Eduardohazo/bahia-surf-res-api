import { RequestStatus } from "../enums/RequestStatus.js";
import { AppError } from "../errors/AppError.js";
import { OrderModel } from "../models/orderModel.js";
import { OrderSchema } from "../schemas/order.schema.js";
import { z } from "zod";

export const getOrderService = async (id) => {
  const rawOrder = await OrderModel.fetchById(id);
  console.log(rawOrder);

  if (!rawOrder) {
    throw new AppError(
      404,
      RequestStatus.responsePhase.ORDER_NOT_FOUND,
      "Order not found"
    );
  }

  // 2. Validation (Integrity Check)
  const parsed = OrderSchema.safeParse(rawOrder);
  if (!parsed.success) {
    // Log the actual Zod error for debugging, but throw a clear message
    console.error("Zod Validation Error - Orders:", z.treeifyError(parsed.error));

    throw new AppError(
      500,
      RequestStatus.responsePhase.DATA_CORRUPTION,
      "Data inconsistency in Database",
    );
  }

  return parsed.data;
};
