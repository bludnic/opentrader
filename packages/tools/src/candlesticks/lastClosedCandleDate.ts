import type { BarSize } from "@opentrader/types";
import { barSizeToDuration } from "./barSizeToDuration.js";

/**
 * Calculate the start time of the last closed candle.
 *
 * @param currentTime - Current time. Pass `Date.now()`.
 * @param barSize - Candlestick timeframe.
 */
export function lastClosedCandleDate(currentTime: number, barSize: BarSize) {
  // Convert timeframe to milliseconds (assuming timeframe is in minutes)
  const timeframeInMilliseconds = barSizeToDuration(barSize);

  // Calculate the number of timeframes that have passed since the epoch
  const timeframesSinceEpoch = Math.floor(
    currentTime / timeframeInMilliseconds,
  );

  // Calculate the start time of the current candle
  const currentCandleStartTime = timeframesSinceEpoch * timeframeInMilliseconds;

  // The last closed candle start time is one timeframe before the current candle
  const lastClosedCandleStartTime =
    currentCandleStartTime - timeframeInMilliseconds;

  return new Date(lastClosedCandleStartTime).toISOString();
}
