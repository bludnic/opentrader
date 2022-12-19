export interface IGetLimitOrderRequest {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId: string;
}
