import type { ExchangeCode, IOrderbook, MarketId } from "@opentrader/types";

export type OrderbookEvent = {
  exchangeCode: ExchangeCode;
  marketId: MarketId;
  symbol: string;
  orderbook: IOrderbook;
};
