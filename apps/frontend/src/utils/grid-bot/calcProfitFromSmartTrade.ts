import big from "big.js";
import { TCompletedSmartTrade } from "src/types/trpc";

// Buy order fee is paid in Base currency
// Sell order fee is paid in Quote currency
export function calcProfitFromSmartTrade(smartTrade: TCompletedSmartTrade) {
  const { entryOrder, takeProfitOrder } = smartTrade;
  const { quantity } = takeProfitOrder;

  const grossProfit = big(takeProfitOrder.filledPrice!)
    .minus(entryOrder.filledPrice!)
    .times(quantity)
    .toNumber();

  // converts fee from baseCurrency to quoteCurrency
  const entryOrderFee = big(entryOrder.fee ?? 0).times(entryOrder.filledPrice!);
  const tpOrderFee = takeProfitOrder.fee ?? 0;
  const totalFee = big(entryOrderFee).plus(tpOrderFee).toNumber();

  const netProfit = big(grossProfit).minus(totalFee).toNumber();

  return {
    grossProfit,
    netProfit,
    entryOrderFee,
    tpOrderFee,
    fee: totalFee,
  };
}
