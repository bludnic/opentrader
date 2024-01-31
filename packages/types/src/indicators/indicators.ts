import type { BarSize } from "../common";

export type IndicatorName = "SMA10" | "SMA15" | "SMA30" | "RSI";
export type IndicatorBarSize = Extract<
  BarSize,
  "1m" | "5m" | "10m" | "15m" | "30m" | "1h" | "4h" | "1d"
>;

export type IndicatorsResult<I extends IndicatorName> = {
  [K in I]: number;
};
