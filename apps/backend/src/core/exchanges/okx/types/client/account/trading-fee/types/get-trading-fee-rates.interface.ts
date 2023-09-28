export interface IOKXGetTradingFeeRates {
  /**
   * Fee Schedule
   */
  category: string;
  /**
   * Taker fee rate.
   *
   * Note: The number is negative.
   */
  taker: string;
  /**
   * Maker fee rate
   *
   * Note: The number is negative.
   */
  maker: string;
  /**
   * Delivery fee rate
   */
  delivery: string;
  /**
   * Fee rate for exercising the option
   */
  exercise: string;
  /**
   * Fee rate Level
   */
  level: 'Lv1' | 'Lv2' | 'Lv3' | 'Lv4' | 'Lv5';
  /**
   * Instrument type, e.g.
   */
  instType: 'SPOT' | 'MARGIN' | 'SWAP' | 'FUTURES' | 'OPTION';
  /**
   * Data return time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  ts: string;
}
