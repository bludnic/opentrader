import big from 'big.js';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { SmartTradeWithProfitDto } from 'src/grid-bot/dto/get-completed-smart-trades/types/smart-trade-with-profit.dto';

export function populateSmartTradeWithProfit(
  completedDeal: ISmartTrade,
  makerTradingFeeRatio: number,
): SmartTradeWithProfitDto {
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
