import { Dictionary, Exchange, Market } from "ccxt";
import { ExchangeCode } from "@opentrader/types";

export interface ICacheProvider {
  getMarkets(
    exchangeCode: ExchangeCode,
    ccxtExchange: Exchange,
  ): Promise<Dictionary<Market>>;
}
