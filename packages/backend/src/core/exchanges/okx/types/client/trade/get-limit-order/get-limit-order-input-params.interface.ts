export interface IOKXGetLimitOrderInputParams {
  /**
   * Instrument ID, e.g. `BTC-USD`
   */
  instId: string;
  /**
   * Client-supplied order ID.
   *
   * A combination of case-sensitive alphanumerics, all numbers, or all letters of up to 32 characters.
   */
  clOrdId: string;
}
