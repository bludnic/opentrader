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
