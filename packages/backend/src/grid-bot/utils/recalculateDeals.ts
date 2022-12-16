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
import {
  DealBuyPlaced,
  DealStatusEnum,
  IDeal,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { updateDealStatus } from 'src/core/db/firestore/utils/deal/updateDealStatus';

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
