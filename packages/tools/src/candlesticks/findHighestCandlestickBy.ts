import { ICandlestick } from "@bifrost/types";

/**
 * Returns highest candlestick by price
 * @param byKey `open | close | high | low`
 * @param candlesticks
 */
export function findHighestCandlestickBy(
  byKey: Exclude<keyof ICandlestick, "timestamp">,
  candlesticks: ICandlestick[]
): ICandlestick {
  const highestCandlestick = candlesticks.reduce((acc, curr) => {
    if (curr[byKey] > acc[byKey]) {
      return curr;
    }

    return acc;
  });

  return highestCandlestick;
}
