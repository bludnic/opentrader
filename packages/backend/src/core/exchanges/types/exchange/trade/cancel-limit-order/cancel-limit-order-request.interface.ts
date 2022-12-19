export interface ICancelLimitOrderRequest {
  /**
   * Instrument ID, e.g. `BTC-USD`
   */
  symbol: string;
  /**
   * Exchange-supplied Order ID
   */
  clientOrderId: string;
}
