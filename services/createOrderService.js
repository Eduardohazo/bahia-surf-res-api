// TODO: Replaced json with mongo DB
import { getAllProducts } from "../services/getAllProductsService.js";
import { OrderModel } from "../models/orderModel.js";
import { AppError } from "../errors/AppError.js";
import { OrderSchema } from "../schemas/order.schema.js";
import { RequestStatus } from "../enums/RequestStatus.js";

export const createOrderService = async (data) => {
  // 1. Validation
  const validatedOrder = OrderSchema.safeParse(data);
  console.log("validated order: ", validatedOrder);

  if (!validatedOrder.success) {
    console.error("Zod Validation Error:", validatedOrder.error.format());
    throw new AppError(
      400,
      RequestStatus.responsePhase.VALIDATION_ERROR,
      "Invalid order data provided",
    );
  }

  // 4. Persist order FIRST
  validatedOrder.data.id_order = `ORD-${Date.now()}`;
  validatedOrder.data.status = "PENDING";
  validatedOrder.data.expiresAt = new Date(
    Date.now() + 30 * 60 * 1000,
  ).toISOString();

  await OrderModel.create(validatedOrder.data);

  return {
    ...validatedOrder.data,
  };
};
