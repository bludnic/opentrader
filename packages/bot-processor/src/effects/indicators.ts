import { USE_RSI_INDICATOR } from "./types/index.js";
import { makeEffect } from "./utils/index.js";

export function useRSI(periods = 14) {
  return makeEffect(USE_RSI_INDICATOR, periods, undefined);
}
