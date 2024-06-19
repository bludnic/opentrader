import type { ICandlestick } from "../market-data/get-candlesticks.js";

export type IWatchCandlesRequest = {
  /**
   * e.g. ADA/USDT
   */
  symbol: string;
};

export type IWatchCandlesResponse = ICandlestick[];
