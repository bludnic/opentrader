import {
  DealSellPlaced,
  DealStatusEnum,
  OrderSideEnum,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { createBuyFilledOrder } from 'src/core/db/firestore/utils/order/createBuyFilledOrder';

export function createSellPlacedDeal(
  dealId: string,
  buyOrderId: string,
  buyOrderPrice: number,
  sellOrderId: string,
  sellOrderPrice: number,
): DealSellPlaced {
  return {
    id: dealId,
    buyOrder: createBuyFilledOrder(buyOrderId, buyOrderPrice),
    sellOrder: {
      id: sellOrderId,
      price: sellOrderPrice,
      side: OrderSideEnum.Sell,
      status: OrderStatusEnum.Placed,
    },
    status: DealStatusEnum.SellPlaced,
  };
}
