import type { BarSize, ICandlestick } from "@opentrader/types";

export type CandleEvent = {
  symbol: string;
  timeframe: BarSize;
  /**
   * Last closed candle
   */
  candle: ICandlestick;
  /**
   * Candles history
   */
  history: ICandlestick[];
};
