import {
  DealBuyFilled,
  DealStatusEnum,
  OrderSideEnum,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { createBuyFilledOrder } from 'src/core/db/firestore/utils/order/createBuyFilledOrder';

export function createBuyFilledDeal(
  dealId: string,
  buyOrderId: string,
  buyOrderPrice: number,
  sellOrderId: string,
  sellOrderPrice: number,
): DealBuyFilled {
  return {
    id: dealId,
    buyOrder: createBuyFilledOrder(buyOrderId, buyOrderPrice),
    sellOrder: {
      id: sellOrderId,
      price: sellOrderPrice,
      side: OrderSideEnum.Sell,
      status: OrderStatusEnum.Idle,
    },
    status: DealStatusEnum.BuyFilled,
  };
}
