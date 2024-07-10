import { OrderStatusEnum, XOrderStatus } from "@opentrader/types";

const map: Record<
  OrderStatusEnum,
  Extract<XOrderStatus, "Idle" | "Placed" | "Filled">
> = {
  [OrderStatusEnum.Idle]: "Idle",
  [OrderStatusEnum.Placed]: "Placed",
  [OrderStatusEnum.Filled]: "Filled",
};

export function toPrismaOrderStatus(
  orderStatus: OrderStatusEnum,
): XOrderStatus {
  return map[orderStatus];
}
