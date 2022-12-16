/**
 * Делает то же что и `recalculateDeals`.
 *
 * Отличие от метода `recalculateDeals` в том что `recalculateDealsDiff`
 * возвращает только ордера у которых статус был изменен.
 *
 * @param deals
 */
import {
  DealBuyPlaced,
  DealStatusEnum,
  IDeal,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { updateDealStatus } from 'src/core/db/firestore/utils/deal/updateDealStatus';

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
