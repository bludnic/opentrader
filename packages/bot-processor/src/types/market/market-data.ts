import type { ICandlestick } from "@opentrader/types";

export interface MarketData {
  /**
   * Lst closed candlestick
   */
  candle?: ICandlestick;
  /**
   * List of previous candles, included last one. Last candle can be accessed by `candles[candles.length - 1]`
   */
  candles: ICandlestick[];
}
