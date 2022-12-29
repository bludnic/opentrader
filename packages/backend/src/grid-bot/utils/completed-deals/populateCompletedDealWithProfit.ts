import big from 'big.js';
import { CompletedDealEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.entity';
import { CompletedDealWithProfitDto } from 'src/grid-bot/dto/get-completed-deals/types/completed-deal-with-profit.dto';

export function populateCompletedDealWithProfit(
  completedDeal: CompletedDealEntity,
): CompletedDealWithProfitDto {
  const { buyOrder, sellOrder } = completedDeal;

  const grossProfit = big(sellOrder.price).minus(buyOrder.price).toNumber();

  // Converts Base currency into Quote by Market Price.
  //
  // Note: Fee should be a negative number;
  const buyOrderFee = -big(buyOrder.feeInBaseCurrency)
    .times(buyOrder.price)
    .toNumber();

  const netProfit = big(grossProfit)
    .plus(sellOrder.feeInQuoteCurrency) // fee is a negative number
    .plus(buyOrderFee) // fee is a negative number
    .toNumber();

  return {
    ...completedDeal,
    grossProfit,
    netProfit,
  };
}
