export type ICancelLimitOrderRequest = {
  /**
   * e.g. ADA/USDT
   */
  symbol: string;
  /**
   * Order ID provided by the exchange
   */
  orderId: string;
};

export interface ICancelLimitOrderResponse {
  /**
   * Exchange-supplied Order ID
   */
  orderId: string;
}
