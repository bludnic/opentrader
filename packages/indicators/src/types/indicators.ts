import type { IndicatorBarSize, IndicatorName } from "@opentrader/types";
import type { OHLCVData } from "./api";

export type Indicator = {
  periods: number;
  timeframes: IndicatorBarSize[];
  compute: (candles: OHLCVData[]) => number;
};

export type IndicatorsMap = Record<IndicatorName, Indicator>;
