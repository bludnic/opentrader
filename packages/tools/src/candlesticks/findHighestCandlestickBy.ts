import type { ICandlestick } from "@opentrader/types";

/**
 * Returns highest candlestick by price
 * @param byKey - Values: `open | close | high | low`
 * @param candlesticks - OHLC data
 */
export function findHighestCandlestickBy(
  byKey: Exclude<keyof ICandlestick, "timestamp">,
  candlesticks: ICandlestick[],
): ICandlestick {
  const highestCandlestick = candlesticks.reduce((acc, curr) => {
    if (curr[byKey] > acc[byKey]) {
      return curr;
    }

    return acc;
  });

  return highestCandlestick;
}
