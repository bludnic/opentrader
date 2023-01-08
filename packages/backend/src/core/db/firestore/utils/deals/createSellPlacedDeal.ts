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
  quantity: number,
): DealSellPlaced {
  return {
    id: dealId,
    quantity,
    buyOrder: createBuyFilledOrder(buyOrderId, buyOrderPrice),
    sellOrder: {
      clientOrderId: sellOrderId,
      price: sellOrderPrice,
      // this function is used for generating initialDeals when bot started, so we don't have the information about the fees
      fee: 0,
      side: OrderSideEnum.Sell,
      status: OrderStatusEnum.Placed,
    },
    status: DealStatusEnum.SellPlaced,
  };
}
