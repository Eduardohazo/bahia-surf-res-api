import { RequestStatus } from "../enums/RequestStatus.js";
import { AppError } from "../errors/AppError.js";
import { OrderModel } from "../models/orderModel.js";
import { OrderSchema } from "../schemas/order.schema.js";
import { z } from "zod";

export const getAllOrders = async () => {
  const rawOrders = await OrderModel.fetchAll();

  // Scenario: Database is empty (Not necessarily an error, but good to know)
  if (!rawOrders || rawOrders.length === 0) {
    return [];
  }

  // 2. Validation (Integrity Check)
  const parsed = OrderSchema.array().safeParse(rawOrders);
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
