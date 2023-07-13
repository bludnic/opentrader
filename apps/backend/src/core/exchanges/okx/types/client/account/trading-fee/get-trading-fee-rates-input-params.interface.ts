export interface IOKXGetTradingFeeRatesInputParams {
  /**
   * Instrument type
   * `SPOT`
   * `MARGIN`
   * `SWAP`
   * `FUTURES`
   * `OPTION`
   */
  instType: 'SPOT'; // we need only SPOT for this service
  /**
   * Instrument ID, e.g. `BTC-USDT`
   * Only applicable to `SPOT/MARGIN`
   */
  instId: string;
  /**
   * Underlying, e.g. `BTC-USD`
   * Only applicable to `FUTURES/SWAP/OPTION`
   */
  // uly?: string; // we don't need this params for SPOT service
  /**
   * Fee Schedule
   * "1": Class A
   * "2": Class B
   * "3": Class C
   * "4": Class D
   */
  // category: '1' | '2' | '3' | '4' | '5'; // not required for SPOT service
}
