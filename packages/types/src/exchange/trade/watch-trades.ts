import type { ITrade } from "../market-data/get-trades.js";

export type IWatchTradesRequest = {
  /**
   * e.g. ADA/USDT
   */
  symbol: string;
};

export type IWatchTradesResponse = ITrade[];
