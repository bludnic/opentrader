import type { ExchangeCode } from "@opentrader/types";

export type IBotConfiguration = {
  id: number;
  baseCurrency: string;
  quoteCurrency: string;
  exchangeCode: ExchangeCode;
  // @todo type
};
