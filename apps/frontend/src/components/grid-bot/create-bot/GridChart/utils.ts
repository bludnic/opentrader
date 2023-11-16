import { IGridLine } from "@opentrader/types";
import { CreatePriceLineOptions } from "lightweight-charts";
import { computePriceLine } from "src/utils/charts";
import { waitingPriceFromCurrentAssetPrice } from "src/utils/grid-bot/waitingPriceFromCurrentAssetPrice";

export function computePriceLines(
  gridLines: IGridLine[],
  currentAssetPrice: number,
): CreatePriceLineOptions[] {
  const prices = gridLines.map((gridLine) => gridLine.price);
  const waitingPrice = waitingPriceFromCurrentAssetPrice(
    prices,
    currentAssetPrice,
  );

  return prices.map(
    (price) => computePriceLine(price, prices, waitingPrice)
  );
}
