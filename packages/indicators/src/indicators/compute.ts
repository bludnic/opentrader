import type { OHLCVData } from "../types";
import { SMA } from "./sma";

export function computeSMA(candles: OHLCVData[], periods: 5 | 10 | 15 | 30) {
  if (candles.length < periods) {
    throw new Error(
      `Not enough data points for the given period: ${periods}. Candles provided: ${candles.length}`,
    );
  }

  const lastCandles = candles.slice(-periods);

  const result = SMA(
    lastCandles.map((x) => x.close),
    periods,
  );

  return result[0];
}
