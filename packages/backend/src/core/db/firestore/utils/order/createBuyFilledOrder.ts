import {
  BuyOrderFilled,
  OrderSideEnum,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export function createBuyFilledOrder(
  orderId: string,
  boughtPrice: number,
): BuyOrderFilled {
  return {
    id: orderId,
    side: OrderSideEnum.Buy,
    status: OrderStatusEnum.Filled,
    price: boughtPrice,
  };
}
