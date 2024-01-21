import type { IndicatorBarSize, IndicatorName } from "@opentrader/types";
import type { UseIndicatorsEffect } from "./common/types/use-indicators-effect";
import { USE_INDICATORS } from "./common/types/effect-types";
import { makeEffect } from "./utils/make-effect";

export function useIndicators<I extends IndicatorName>(
  indicators: IndicatorName[],
  barSize: IndicatorBarSize,
): UseIndicatorsEffect {
  return makeEffect(USE_INDICATORS, {
    indicators,
    barSize,
  });
}
