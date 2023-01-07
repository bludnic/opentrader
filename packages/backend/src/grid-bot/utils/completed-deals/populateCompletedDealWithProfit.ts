import big from 'big.js';
import { CompletedDealEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.entity';
import { CompletedDealWithProfitDto } from 'src/grid-bot/dto/get-completed-deals/types/completed-deal-with-profit.dto';

export function populateCompletedDealWithProfit(
  completedDeal: CompletedDealEntity,
  makerTradingFeeRatio: number,
): CompletedDealWithProfitDto {
  const { buyOrder, sellOrder, quantity } = completedDeal;

  const grossProfit = big(sellOrder.price)
    .minus(buyOrder.price)
    .times(quantity)
    .toNumber();

  // Converts Base currency into Quote by Market Price.
  const buyOrderFee = big(quantity)
    .times(makerTradingFeeRatio)
    .times(buyOrder.price)
    .toNumber();

  const sellOrderFee = big(quantity)
    .times(sellOrder.price)
    .times(makerTradingFeeRatio);

  const netProfit = big(grossProfit)
    .minus(sellOrderFee)
    .minus(buyOrderFee)
    .toNumber();

  return {
    ...completedDeal,
    grossProfit,
    netProfit,
  };
}
