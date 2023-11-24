import type { Dictionary, Exchange, Market } from "ccxt";
import type { ExchangeCode } from "@opentrader/types";

export interface ICacheProvider {
  getMarkets: (
    exchangeCode: ExchangeCode,
    ccxtExchange: Exchange,
  ) => Promise<Dictionary<Market>>;
}
