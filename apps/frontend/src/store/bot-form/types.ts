import type { BarSize } from "@opentrader/types";

export type GridBotFormChartBarSize = Extract<
  BarSize,
  "1d" | "4h" | "1h" | "5m"
>;
export type GridBotFormType = "simple" | "advanced";
