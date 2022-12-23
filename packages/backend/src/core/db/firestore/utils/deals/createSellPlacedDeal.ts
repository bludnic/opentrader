import { createBuyFilledOrder } from 'src/core/db/firestore/utils/orders/createBuyFilledOrder';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { DealSellPlaced } from 'src/core/db/types/entities/grid-bots/deals/types';


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
