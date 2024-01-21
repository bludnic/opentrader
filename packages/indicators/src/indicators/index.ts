import type { IndicatorsMap } from "../types/indicators";
import { computeSMA } from "./compute";

export const indicatorsMap: IndicatorsMap = {
  SMA10: {
    periods: 10,
    timeframes: ["1m", "5m"],
    compute: (candles) => computeSMA(candles, 10),
  },
  SMA15: {
    periods: 15,
    timeframes: ["1m", "5m"],
    compute: (candles) => computeSMA(candles, 15),
  },
  SMA30: {
    periods: 30,
    timeframes: ["1m", "5m"],
    compute: (candles) => computeSMA(candles, 30),
  },
  RSI: { periods: NaN, timeframes: ["1m", "5m"], compute: () => NaN },
};
