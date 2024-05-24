import { USE_MARKET, USE_CANDLE } from "./types";
import { makeEffect } from "./utils";

export function useMarket() {
  return makeEffect(USE_MARKET, undefined, undefined);
}

/**
 * Get candle data for the given index.
 * If the index is negative, it will return the candle data from the end.
 * By default, will return the last candle.
 */
export function useCandle(index = -1) {
  return makeEffect(USE_CANDLE, index, undefined);
}
