import { Order } from "ccxt";
import { OrderStatus } from "@bifrost/types";

export function normalizeOrderStatus(
  order: Pick<Order, "filled" | "amount" | "status">
): OrderStatus {
  if (order.status === "open") {
    return "open";
  } else if (order.status === "canceled") {
    return "canceled";
  } else if (order.status === "closed") {
    if (order.filled >= order.amount) {
      return "filled";
    } else if (order.filled < order.amount) {
      return "partially_filled";
    }
  }

  throw Error("normalizeOrderStatus: Impossible order status");
}
