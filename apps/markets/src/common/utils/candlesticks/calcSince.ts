/**
 *  Calc `startDate` based on `endDate`, `limit`, and `timeframe`
 * @param endDate
 */
import { BarSize } from '@opentrader/types';

const ONE_MINUTE_MS = 60 * 1000;
const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
const ONE_DAY_MS = ONE_HOUR_MS * 24;

const timeframeMs: Record<BarSize, number> = {
  [BarSize.ONE_MINUTE]: ONE_MINUTE_MS,
  [BarSize.FIVE_MINUTES]: ONE_MINUTE_MS * 5,
  [BarSize.FIFTEEN_MINUTES]: ONE_MINUTE_MS * 15,
  [BarSize.ONE_HOUR]: ONE_HOUR_MS,
  [BarSize.FOUR_HOURS]: ONE_HOUR_MS * 4,
  [BarSize.ONE_DAY]: ONE_DAY_MS,
  [BarSize.ONE_WEEK]: ONE_DAY_MS * 7,
  [BarSize.ONE_MONTH]: ONE_DAY_MS * 30,
  [BarSize.THREE_MONTHS]: ONE_DAY_MS * 120,
};

export function calcSince(
  endDate: number,
  timeframe: BarSize,
  limit: number,
): number {
  return endDate - timeframeMs[timeframe] * limit;
}
