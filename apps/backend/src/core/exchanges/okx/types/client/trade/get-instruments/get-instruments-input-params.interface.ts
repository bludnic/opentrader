export interface IOKXGetInstrumentsInputParams {
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
  instId?: string;
  /**
   * Underlying
   * Only applicable to `FUTURES/SWAP/OPTION`. If instType is `OPTION`, either `uly` or `instFamily` is required.
   */
  uly?: string;
  /**
   * Instrument family
   * Only applicable to `FUTURES/SWAP/OPTION`. If instType is `OPTION`, either `uly` or `instFamily` is required.
   */
  instFamily?: string;
}
