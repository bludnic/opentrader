import type { ICandlestick } from "@opentrader/types";

/**
 * Returns lowest candlestick by price
 * @param byKey - Values: `open | close | high | low`
 * @param candlesticks - OHLC data
 */
export function findLowestCandlestickBy(
  byKey: Exclude<keyof ICandlestick, "timestamp">,
  candlesticks: ICandlestick[],
): ICandlestick {
  const lowestCandlestick = candlesticks.reduce((acc, curr) => {
    if (curr[byKey] < acc[byKey]) {
      return curr;
    }

    return acc;
  });

  return lowestCandlestick;
}
