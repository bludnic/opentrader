import type { BarSize } from "@opentrader/types";
import { barSizeDurationMap } from "@opentrader/tools";

/**
 * Rounds a timestamp with `barSize` precision
 * @param timestamp - Timestamp
 * @param barSize - Timeframe
 */
export function roundTimestamp(timestamp: number, barSize: BarSize) {
  const DURATION = barSizeDurationMap[barSize];

  return Math.floor(timestamp / DURATION) * DURATION;
}
