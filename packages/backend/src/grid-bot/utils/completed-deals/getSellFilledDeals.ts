import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import {
  DealSellFilled,
  IDeal,
} from 'src/core/db/types/entities/grid-bots/deals/types';

export function getSellFilledDeals(deals: IDeal[]): DealSellFilled[] {
  const sellFilledDeals: DealSellFilled[] = [];

  deals.forEach((deal) => {
    if (deal.status === DealStatusEnum.SellFilled) {
      sellFilledDeals.push(deal);
    }
  });

  return sellFilledDeals;
}
