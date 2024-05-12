import type { BarSize, ICandlestick } from "@opentrader/types";

export type CandleEvent = {
  symbol: string;
  timeframe: BarSize;
  candle: ICandlestick;
};
