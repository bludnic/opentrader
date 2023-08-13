import { Order } from "ccxt";
import { OrderStatus } from "@bifrost/types";

export function normalizeOrderStatus(
  order: Pick<Order, "filled" | "amount" | "status">
): OrderStatus {
  if (order.filled >= order.amount) {
    return "filled";
  } else if (order.filled < order.amount) {
    return "partially_filled";
  } else if (order.status === "open") {
    return "open";
  } else if (order.status === "canceled") {
    return "canceled";
  }

  throw Error("normalizeOrderStatus: Impossible order status");
}
