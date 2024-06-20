import type { $Enums, Prisma } from "@opentrader/db";
import { OrderStatusEnum, OrderType } from "@opentrader/types";
import { toPrismaOrderStatus } from "./toPrismaOrderStatus.js";

export function toPrismaOrder(
  order: {
    type?: OrderType;
    status?: OrderStatusEnum;
    price?: number;
  },
  quantity: number,
  side: $Enums.OrderSide,
  entityType: $Enums.EntityType,
): Prisma.OrderCreateManySmartTradeInput {
  return {
    status: toPrismaOrderStatus(order.status || OrderStatusEnum.Idle),
    type: order.type || OrderType.Limit,
    entityType,
    price: order.price,
    // Must be a number when Order["status"] is Filled to satisfy
    // Order entity type.
    //
    // The BUY order price with status Filled is introduced by the user,
    // so we must believe that he bought that asset at a specified price
    filledPrice: order.status === OrderStatusEnum.Filled ? order.price : null,
    placedAt: new Date(), // we don't know this information
    filledAt: new Date(), // we don't know this information
    side,
    quantity,
  };
}
