import type { ExchangeCode } from "@opentrader/types";

export type IBotConfiguration<T extends any = any> = {
  id: number;
  baseCurrency: string;
  quoteCurrency: string;
  exchangeCode: ExchangeCode;
  settings: T;
};
