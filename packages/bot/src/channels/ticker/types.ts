import type { ITicker } from "@opentrader/types";

export type TickerEvent = {
  symbol: string;
  ticker: ITicker;
};
