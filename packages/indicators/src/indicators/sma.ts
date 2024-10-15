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
import { SMA } from "technicalindicators";
import { IndicatorError } from "../utils/indicator.error.js";

type SmaParams = {
  periods: number;
};

/**
 * Calculate the Simple Moving Average (SMA).
 *
 * @param params - SMA params
 * @param candles - List of candles
 * @returns The SMA values. If there are not enough data points to calculate the SMA, the initial values will be NaN.
 */
export async function sma(
  params: SmaParams,
  candles: ICandlestick[],
): Promise<number[]> {
  const prices = candles.map((candle) => candle.close);

  if (params.periods < 2) {
    throw new IndicatorError("SMA requires at least 2 periods", "SMA");
  }

  if (candles.length < 1) {
    throw new IndicatorError("No candles provided", "SMA");
  }

  const indicatorValues = SMA.calculate({
    period: params.periods,
    values: prices,
  });
  const emptyIndicatorValue = new Array<number>(
    candles.length - indicatorValues.length,
  ).fill(NaN);

  return [...emptyIndicatorValue, ...indicatorValues];
}
