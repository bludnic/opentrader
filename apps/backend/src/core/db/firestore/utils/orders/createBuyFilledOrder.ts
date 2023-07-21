import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { BuyOrderFilled } from 'src/core/db/types/entities/grid-bots/orders/types';

export function createBuyFilledOrder(
  orderId: string,
  boughtPrice: number,
): BuyOrderFilled {
  return {
    clientOrderId: orderId,
    side: OrderSideEnum.Buy,
    status: OrderStatusEnum.Filled,
    price: boughtPrice,
    // this function is used for generating initialDeals when bot started, so we don't have the information about the fees
    fee: 0,
  };
}
