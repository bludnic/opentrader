import { OrderStatusEnum, XOrderStatus } from "@opentrader/types";

const map: Record<XOrderStatus, OrderStatusEnum> = {
  Idle: OrderStatusEnum.Idle,
  Placed: OrderStatusEnum.Placed,
  Filled: OrderStatusEnum.Filled,

  // Normally these type of orders cannot be requested
  // by the `bot-processor`. For now, to make TS happy
  // I will keep this workaround.
  Canceled: OrderStatusEnum.Idle,
  Deleted: OrderStatusEnum.Idle,
  Revoked: OrderStatusEnum.Idle,
};

export function toProcessorOrderStatus(
  orderStatus: XOrderStatus,
): OrderStatusEnum {
  return map[orderStatus];
}
