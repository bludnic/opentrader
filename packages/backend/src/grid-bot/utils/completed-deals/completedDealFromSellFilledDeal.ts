import { ICompletedDeal } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.interface';
import { DealSellFilled } from 'src/core/db/types/entities/grid-bots/deals/types';

export function completedDealFromSellFilledDeal(
  deal: DealSellFilled,
): Omit<ICompletedDeal, 'id' | 'createdAt' | 'botId'> {
  return {
    buyOrder: {
      price: deal.buyOrder.price,
      feeInBaseCurrency: deal.buyOrder.fee,
    },
    sellOrder: {
      price: deal.sellOrder.price,
      feeInQuoteCurrency: deal.sellOrder.fee,
    },
  };
}
