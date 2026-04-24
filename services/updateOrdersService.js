import { OrderModel } from "../models/orderModel.js";

export const updateOrders = async (forUpdateOrders) => {
  // Only if expired orders exists update them

  if (!forUpdateOrders.length <= 0) {
    for (const order of forUpdateOrders) {
      await OrderModel.deleteById(order._id);
    }
  }
};
