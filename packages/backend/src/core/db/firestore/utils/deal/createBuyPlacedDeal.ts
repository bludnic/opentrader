import {
  DealBuyPlaced,
  DealStatusEnum,
  OrderSideEnum,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export function createBuyPlacedDeal(
  dealId: string,
  buyOrderId: string,
  buyOrderPrice: number,
  sellOrderId: string,
  sellOrderPrice: number,
): DealBuyPlaced {
  return {
    id: dealId,
    buyOrder: {
      id: buyOrderId,
      price: buyOrderPrice,
      side: OrderSideEnum.Buy,
      status: OrderStatusEnum.Placed,
    },
    sellOrder: {
      id: sellOrderId,
      price: sellOrderPrice,
      side: OrderSideEnum.Sell,
      status: OrderStatusEnum.Idle,
    },
    status: DealStatusEnum.BuyPlaced,
  };
}
