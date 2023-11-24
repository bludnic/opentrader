import type { OrderStatus } from "@opentrader/types";
import type { $Enums } from "@opentrader/db";

/**
 * Map Exchange order status to DB order status
 * @param status - Order status
 */
export function toDbStatus(status: OrderStatus): $Enums.OrderStatus {
  switch (status) {
    case "open":
      return "Placed";
    case "partially_filled":
      return "Placed";
    case "filled":
      return "Filled";
    case "canceled":
      return "Canceled";
  }
}
