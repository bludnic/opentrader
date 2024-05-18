import { USE_RSI_INDICATOR } from "./types";
import { makeEffect } from "./utils";

export function useRSI(periods = 14) {
  return makeEffect(USE_RSI_INDICATOR, periods, undefined);
}
