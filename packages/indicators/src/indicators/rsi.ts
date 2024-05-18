import type { ICandlestick } from "@opentrader/types";
import { RSI } from "technicalindicators";
import { IndicatorError } from "../utils/indicator.error";

type RsiParams = {
  periods: number;
};

/**
 * Calculate the Relative Strength Index (RSI) for a given set of candles.
 *
 * @param params - RSI parameters
 * @param candles - The candles to calculate the RSI for
 * @returns The RSI values. If there are not enough data points to calculate the RSI, the initial values will be NaN.
 */
export async function rsi(
  params: RsiParams,
  candles: ICandlestick[],
): Promise<number[]> {
  const prices = candles.map((candle) => candle.close);

  if (params.periods < 2) {
    throw new IndicatorError("RSI requires at least 2 periods", "RSI");
  }

  if (candles.length < 1) {
    throw new IndicatorError("No candles provided", "RSI");
  }

  const rsiValues = RSI.calculate({
    period: params.periods,
    values: prices,
  });
  const emptyRsiValues = new Array<number>(
    candles.length - rsiValues.length,
  ).fill(NaN);

  return [...emptyRsiValues, ...rsiValues];
}
