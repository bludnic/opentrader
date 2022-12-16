export interface IOKXGetMarketPriceInputParams {
  /**
   * Instrument type
   * `MARGIN`
   * `SWAP`
   * `FUTURES`
   * `OPTION`
   */
  instType: string;
  /**
   * Instrument ID, e.g. `ADA-USDT`
   */
  instId: string;
  /**
   * Underlying
   */
  uly?: string;
}
