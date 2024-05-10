import type { ExchangeCode } from "@opentrader/types";

export type IBotConfiguration<T = any> = {
  id: number;
  baseCurrency: string;
  quoteCurrency: string;
  exchangeCode: ExchangeCode;
  settings: T;
  label?: string;
};
