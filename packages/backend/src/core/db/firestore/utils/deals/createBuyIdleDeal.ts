import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { DealIdle } from 'src/core/db/types/entities/grid-bots/deals/types';

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
