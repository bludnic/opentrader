import big from "big.js";
import type { TCompletedSmartTrade } from "src/types/trpc";
import { calcProfitFromSmartTrade } from "./calcProfitFromSmartTrade";

export function calcTotalProfitFromSmartTrades(
  smartTrades: TCompletedSmartTrade[],
): number {
  let profit = big(0);

  for (const smartTrade of smartTrades) {
    const { netProfit } = calcProfitFromSmartTrade(smartTrade);

    profit = profit.plus(netProfit);
  }

  return profit.toNumber();
}
