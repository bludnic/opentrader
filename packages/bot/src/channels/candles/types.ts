import type { BarSize, ExchangeCode, ICandlestick, MarketId } from "@opentrader/types";

export type CandleEvent = {
  exchangeCode: ExchangeCode;
  symbol: string;
  marketId: MarketId;
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
