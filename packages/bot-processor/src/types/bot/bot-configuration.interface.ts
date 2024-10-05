import type { BarSize, ExchangeCode } from "@opentrader/types";

export type IBotConfiguration<T = any> = {
  id: number;
  symbol: string;
  exchangeCode?: ExchangeCode; // @todo maybe remove
  settings: T;
  timeframe?: BarSize | null;
};
