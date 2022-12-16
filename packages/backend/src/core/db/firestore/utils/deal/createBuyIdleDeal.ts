import {
  DealIdle,
  DealStatusEnum,
  OrderSideEnum,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export function createBuyIdleDeal(
  dealId: string,
  buyOrderId: string,
  buyOrderPrice: number,
  sellOrderId: string,
  sellOrderPrice: number,
): DealIdle {
  return {
    id: dealId,
    buyOrder: {
      id: buyOrderId,
      price: buyOrderPrice,
      side: OrderSideEnum.Buy,
      status: OrderStatusEnum.Idle,
    },
    sellOrder: {
      id: sellOrderId,
      price: sellOrderPrice,
      side: OrderSideEnum.Sell,
      status: OrderStatusEnum.Idle,
    },
    status: DealStatusEnum.Idle,
  };
}
