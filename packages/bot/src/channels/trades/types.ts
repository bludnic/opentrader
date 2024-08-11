import type { ITrade } from "@opentrader/types";

export type TradeEvent = {
  symbol: string;
  trade: ITrade;
};
