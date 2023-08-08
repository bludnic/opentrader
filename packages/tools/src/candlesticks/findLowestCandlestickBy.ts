import { ICandlestick } from "@bifrost/types";

/**
 * Returns lowest candlestick by price
 * @param byKey `open | close | high | low`
 * @param candlesticks
 */
export function findLowestCandlestickBy(
  byKey: Exclude<keyof ICandlestick, "timestamp">,
  candlesticks: ICandlestick[]
): ICandlestick {
  const lowestCandlestick = candlesticks.reduce((acc, curr) => {
    if (curr[byKey] < acc[byKey]) {
      return curr;
    }

    return acc;
  });

  return lowestCandlestick;
}
