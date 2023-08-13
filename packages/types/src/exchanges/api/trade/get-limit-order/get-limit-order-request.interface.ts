export type IGetLimitOrderRequest = {
  /**
   * e.g. ADA/USDT
   */
  symbol: string;
  /**
   * Order ID provided by the exchange
   */
  orderId: string;
}
