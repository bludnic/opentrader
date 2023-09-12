import { $Enums, Prisma } from '@bifrost/prisma';
import { OrderStatusEnum } from '@bifrost/types';
import { toPrismaOrderStatus } from 'src/trpc/domains/grid-bot/processing/utils/order-status';

export function toPrismaOrder(
  order: {
    status?: OrderStatusEnum;
    price: number;
  },
  quantity: number,
  side: $Enums.OrderSide,
): Prisma.OrderCreateManySmartTradeInput {
  return {
    status: toPrismaOrderStatus(order.status || OrderStatusEnum.Idle),
    price: order.price,
    side,
    quantity,
  };
}
