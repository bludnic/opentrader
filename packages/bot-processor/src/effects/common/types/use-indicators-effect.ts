import type { IndicatorBarSize, IndicatorName } from "@opentrader/types";
import type { BaseEffect } from "./base-effect";
import type { USE_INDICATORS } from "./effect-types";

export type UseIndicatorsEffect = BaseEffect<
  typeof USE_INDICATORS,
  {
    indicators: IndicatorName[];
    barSize: IndicatorBarSize;
  }
>;
