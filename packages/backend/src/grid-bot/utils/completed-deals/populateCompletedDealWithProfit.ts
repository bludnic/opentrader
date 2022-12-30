import big from 'big.js';
import { CompletedDealEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.entity';
import { CompletedDealWithProfitDto } from 'src/grid-bot/dto/get-completed-deals/types/completed-deal-with-profit.dto';

export function populateCompletedDealWithProfit(
  completedDeal: CompletedDealEntity,
  quantityPerGrid: number,
  makerTradingFeeRatio: number,
): CompletedDealWithProfitDto {
  const { buyOrder, sellOrder } = completedDeal;

  const grossProfit = big(sellOrder.price)
    .minus(buyOrder.price)
    .times(quantityPerGrid)
    .toNumber();

  // Converts Base currency into Quote by Market Price.
  const buyOrderFee = big(quantityPerGrid)
    .times(makerTradingFeeRatio)
    .times(buyOrder.price)
    .toNumber();

  const sellOrderFee = big(quantityPerGrid)
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
