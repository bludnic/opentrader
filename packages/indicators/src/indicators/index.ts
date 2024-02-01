import type { IndicatorBarSize } from "@opentrader/types";
import type { IndicatorsMap } from "../types/indicators";
import { computeSMA } from "./compute";

const timeframes: IndicatorBarSize[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

export const indicatorsMap: IndicatorsMap = {
  SMA5: {
    periods: 5,
    timeframes,
    compute: (candles) => computeSMA(candles, 5),
  },
  SMA10: {
    periods: 10,
    timeframes,
    compute: (candles) => computeSMA(candles, 10),
  },
  SMA15: {
    periods: 15,
    timeframes,
    compute: (candles) => computeSMA(candles, 15),
  },
  SMA30: {
    periods: 30,
    timeframes,
    compute: (candles) => computeSMA(candles, 30),
  },
  RSI: { periods: NaN, timeframes: ["1m", "5m"], compute: () => NaN },
};
