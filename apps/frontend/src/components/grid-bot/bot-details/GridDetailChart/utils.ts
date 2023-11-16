import { CreatePriceLineOptions } from "lightweight-charts";
import { TActiveSmartTrade } from "src/types/trpc";
import { computePriceLine } from "src/utils/charts";
import { getWaitingGridLinePrice } from "src/utils/grid-bot/getWaitingGridLinePrice";

export function computePriceLines(
  smartTrades: TActiveSmartTrade[],
): CreatePriceLineOptions[] {
  if (smartTrades.length === 0) {
    return [];
  }

  const waitingPriceLine = getWaitingGridLinePrice(smartTrades);
  const otherPriceLines = smartTrades.map((smartTrade) => {
    const isPositionOpen = smartTrade.entryOrder.status === "Filled";

    if (isPositionOpen) {
      return smartTrade.takeProfitOrder.price!;
    }

    return smartTrade.entryOrder.price!;
  });

  const priceLines = [...otherPriceLines, waitingPriceLine].sort();

  return priceLines.map((priceLine) =>
    computePriceLine(priceLine, priceLines, waitingPriceLine),
  );
}
