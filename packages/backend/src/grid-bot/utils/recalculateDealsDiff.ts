/**
 * Делает то же что и `recalculateDeals`.
 *
 * Отличие от метода `recalculateDeals` в том что `recalculateDealsDiff`
 * возвращает только ордера у которых статус был изменен.
 *
 * @param deals
 */
import { updateDealStatus } from 'src/core/db/firestore/utils/deals/updateDealStatus';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';

export function recalculateDealsDiff(deals: IDeal[]): IDeal[] {
  const newDeals: IDeal[] = deals.flatMap<IDeal>((deal) => {
    if (deal.status === DealStatusEnum.BuyFilled) {
      const newSellPlacedDeal = updateDealStatus(
        deal,
        DealStatusEnum.SellPlaced,
      );

      return [newSellPlacedDeal];
    } else if (deal.status === DealStatusEnum.SellFilled) {
      const newBuyPlacedDeal = updateDealStatus(deal, DealStatusEnum.BuyPlaced);

      return [newBuyPlacedDeal];
    }

    return [];
  });

  return newDeals;
}
