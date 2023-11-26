import type { BarSize } from "@opentrader/types";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

export const barSizeDurationMap: Record<BarSize, number> = {
  "1m": ONE_MINUTE,
  "5m": 5 * ONE_MINUTE,
  "15m": 15 * ONE_MINUTE,
  "1h": ONE_HOUR,
  "4h": 4 * ONE_HOUR,
  "1d": ONE_DAY,
  "1w": 7 * ONE_DAY,
  "1M": 30 * ONE_DAY, // may require special approach because number of days in a month is not fixed
  "3M": 90 * ONE_DAY, // may require special approach because number of days in a month is not fixed
};

/**
 * Returns duration of `barSize` in `ms`
 */
export function barSizeToDuration(barSize: BarSize) {
  return barSizeDurationMap[barSize];
}

/**
 * Rounds a timestamp with `barSize` precision
 * @param timestamp - Timestamp
 * @param barSize - Timeframe
 */
export function roundTimestamp(timestamp: number, barSize: BarSize) {
  const DURATION = barSizeDurationMap[barSize];

  return Math.floor(timestamp / DURATION) * DURATION;
}
