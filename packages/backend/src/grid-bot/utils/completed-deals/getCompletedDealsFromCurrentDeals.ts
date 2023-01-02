import { CreateCompletedDealDto } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/dto/create-completed-deal.dto';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { completedDealFromSellFilledDeal } from 'src/grid-bot/utils/completed-deals/completedDealFromSellFilledDeal';
import { getSellFilledDeals } from './getSellFilledDeals';

export function getCompletedDealsFromCurrentDeals(
  deals: IDeal[],
): CreateCompletedDealDto[] {
  const sellFilledDeals = getSellFilledDeals(deals);
  const completedDeals = sellFilledDeals.map(completedDealFromSellFilledDeal);

  return completedDeals;
}
