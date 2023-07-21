type ICancelLimitOrderRequestData = {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
}

type ICancelLimitOrderRequestWithClientOrderId = {
  /**
   * Client-supplied order ID
   */
  clientOrderId: string;
} & ICancelLimitOrderRequestData;

type ICancelLimitOrderRequestWithExchangeOrderId = {
  /**
   * Order ID provided by the exchange
   */
  exchangeOrderId: string;
} & ICancelLimitOrderRequestData;

export type ICancelLimitOrderRequest = 
  ICancelLimitOrderRequestWithClientOrderId |
  ICancelLimitOrderRequestWithExchangeOrderId
