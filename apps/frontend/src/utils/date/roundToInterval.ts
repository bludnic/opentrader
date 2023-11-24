import type { TBarSize } from "src/types/literals";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;

type Timeframe = Extract<TBarSize, "1m" | "5m" | "15m" | "1h" | "4h" | "1d">;

const timeframeTimeMap: Record<Timeframe, number> = {
  "1m": ONE_MINUTE,
  "5m": 5 * ONE_MINUTE,
  "15m": 15 * ONE_MINUTE,
  "1h": ONE_HOUR,
  "4h": 4 * ONE_HOUR,
  "1d": 24 * ONE_HOUR,
};

/**
 * Omit seconds and milliseconds. Round to minutes / hours / days, depending on `timeframe`.
 * @param timestamp - Timestamp
 * @param timeframe - Timeframe
 */
export function roundToInterval(timestamp: number, timeframe: Timeframe) {
  const INTERVAL = timeframeTimeMap[timeframe];

  return Math.floor(timestamp / INTERVAL) * INTERVAL;
}
