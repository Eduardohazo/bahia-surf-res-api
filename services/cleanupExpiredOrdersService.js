// services/orderCleanup.service.js
import { isExpired } from "../utils/isExpired.js";
import { updateOrders } from "../services/updateOrdersService.js";
import { getAllProducts } from "../services/getAllProductsService.js";
import { getAllOrders } from "../services/getAllOrdersService.js";

// TODO: Just make sure/investigate if I have to use AppError or not in this case
export const cleanupExpiredOrdersService = async () => {
  const orders = await getAllOrders();

  // To set available products reserved by expired orders
  const products = await getAllProducts();

  // Removing expired orders
  const expiredOrders = [];

  // Push only not expired orders in the new array of orders
  for (const order of orders) {
    if (isExpired(order.expiresAt)) {
      expiredOrders.push(order);

      // ONLY for expired
      for (const item of order.items) {
        const product = products.find((p) => p.id_product === item.productId);
        if (product) {
          product.stock_reserved -= item.qty;
          if (product.stock_reserved < 0) {
            product.stock_reserved = 0;
          }
        }
      }
    }
  }

  console.log(expiredOrders);

  await updateOrders(expiredOrders);
};
