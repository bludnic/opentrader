import type { IOrderbook } from "@opentrader/types";

export type OrderbookEvent = {
  symbol: string;
  orderbook: IOrderbook;
};
