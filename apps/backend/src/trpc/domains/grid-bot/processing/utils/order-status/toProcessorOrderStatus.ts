import { $Enums } from '@bifrost/prisma';
import { OrderStatusEnum } from '@bifrost/types';

const map: Record<$Enums.OrderStatus, OrderStatusEnum> = {
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
  orderStatus: $Enums.OrderStatus,
): OrderStatusEnum {
  return map[orderStatus];
}
