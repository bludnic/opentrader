import { OrderStatusEnum } from '@bifrost/types';
import { $Enums } from '@bifrost/prisma';

const map: Record<
  OrderStatusEnum,
  Extract<$Enums.OrderStatus, 'Idle' | 'Placed' | 'Filled'>
> = {
  [OrderStatusEnum.Idle]: 'Idle',
  [OrderStatusEnum.Placed]: 'Placed',
  [OrderStatusEnum.Filled]: 'Filled',
};

export function toPrismaOrderStatus(
  orderStatus: OrderStatusEnum,
): $Enums.OrderStatus {
  return map[orderStatus];
}
