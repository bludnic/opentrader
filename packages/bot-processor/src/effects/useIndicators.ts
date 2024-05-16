import type { IndicatorBarSize, IndicatorName } from "@opentrader/types";
import { makeEffect } from "./utils";
import { USE_INDICATORS } from "./types";

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
