import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { DealBuyPlaced } from 'src/core/db/types/entities/grid-bots/deals/types';

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
      clientOrderId: buyOrderId,
      price: buyOrderPrice,
      side: OrderSideEnum.Buy,
      status: OrderStatusEnum.Placed,
    },
    sellOrder: {
      clientOrderId: sellOrderId,
      price: sellOrderPrice,
      side: OrderSideEnum.Sell,
      status: OrderStatusEnum.Idle,
    },
    status: DealStatusEnum.BuyPlaced,
  };
}
