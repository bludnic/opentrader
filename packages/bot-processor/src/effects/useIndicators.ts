import type { IndicatorBarSize, IndicatorName } from "@opentrader/types";
import { makeEffect } from "./utils/index.js";
import { USE_INDICATORS } from "./types/index.js";

export function useIndicators<I extends IndicatorName>(
  indicators: IndicatorName[],
  barSize: IndicatorBarSize,
) {
  return makeEffect(
    USE_INDICATORS,
    {
      indicators,
      barSize,
    },
    undefined,
  );
}
