import type { ExchangeCode, ITicker, MarketId } from "@opentrader/types";

export type TickerEvent = {
  exchangeCode: ExchangeCode;
  marketId: MarketId;
  symbol: string;
  ticker: ITicker;
};
