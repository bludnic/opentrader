import type { ExchangeCode, ITrade, MarketId } from "@opentrader/types";

export type TradeEvent = {
  exchangeCode: ExchangeCode;
  marketId: MarketId;
  symbol: string;
  trade: ITrade;
};
