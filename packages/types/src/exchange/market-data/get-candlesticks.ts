import type { BarSize } from "../../common/enums.js";

export interface IGetCandlesticksRequest {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
  bar?: BarSize;
  /**
   * Number of results per request.
   */
  limit?: number;
  /**
   * Return results since specified timestamp.
   */
  since?: number;
}

export interface ICandlestick {
  /**
   * Opening time of the candlestick, Unix timestamp format in milliseconds,
   * e.g. `1597026383085`
   */
  open: number;
  high: number;
  low: number;
  close: number;
  /**
   * Data generation time, Unix timestamp format in milliseconds,
   * e.g. `1597026383085`
   */
  timestamp: number;
}
