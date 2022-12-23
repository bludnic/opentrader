/**
 * Проверяем статус заполненных (Filled) ордеров и:
 *
 * - Если Buy order заполнен - возвращаем Sell ордер со статусом SellPlaced
 * - Если Sell order заполнен - выставляем Buy ордер со статусом BuyPlaced
 *
 * Новые ордера буду выставлены на биржу во время синка.
 *
 * @param deals
 */
import { updateDealStatus } from 'src/core/db/firestore/utils/deals/updateDealStatus';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';

export function recalculateDeals(deals: IDeal[]): IDeal[] {
  const newDeals: IDeal[] = deals.map((deal) => {
    if (deal.status === DealStatusEnum.BuyFilled) {
      return updateDealStatus(deal, DealStatusEnum.SellPlaced);
    } else if (deal.status === DealStatusEnum.SellFilled) {
      return updateDealStatus(deal, DealStatusEnum.BuyPlaced);
    }

    return deal;
  });

  return newDeals;
}
