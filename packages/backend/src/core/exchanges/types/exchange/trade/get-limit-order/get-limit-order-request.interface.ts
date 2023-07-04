type IGetLimitOrderRequestData = {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
}

type IGetLimitOrderRequestWithClientOrderId = {
  /**
   * Client-supplied order ID
   */
  clientOrderId: string;
} & IGetLimitOrderRequestData;

type IGetLimitOrderRequestWithExchangeOrderId = {
  /**
   * Order ID provided by the exchange
   */
  exchangeOrderId: string;
} & IGetLimitOrderRequestData;

export type IGetLimitOrderRequest =
  IGetLimitOrderRequestWithClientOrderId |
  IGetLimitOrderRequestWithExchangeOrderId
