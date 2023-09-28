export interface IOKXGetMarketPriceData {
  /**
   * Instrument ID
   */
  instType: string;
  /**
   * Instrument ID, e.g. `ADA-USDT`
   */
  instId: string;
  /**
   * Mark price
   */
  markPx: string;
  /**
   * Data return time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  ts: string;
}
