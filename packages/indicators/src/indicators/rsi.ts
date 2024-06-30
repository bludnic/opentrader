/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
import type { ICandlestick } from "@opentrader/types";
import { RSI } from "technicalindicators";
import { IndicatorError } from "../utils/indicator.error.js";

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
