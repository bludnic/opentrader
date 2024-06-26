import { OrderStatusEnum } from "@opentrader/types";
import type { $Enums } from "@opentrader/db";

const map: Record<
  OrderStatusEnum,
  Extract<$Enums.OrderStatus, "Idle" | "Placed" | "Filled">
> = {
  [OrderStatusEnum.Idle]: "Idle",
  [OrderStatusEnum.Placed]: "Placed",
  [OrderStatusEnum.Filled]: "Filled",
};

export function toPrismaOrderStatus(
  orderStatus: OrderStatusEnum,
): $Enums.OrderStatus {
  return map[orderStatus];
}
