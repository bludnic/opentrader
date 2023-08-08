type IOKXCancelLimitOrderCommonInputParams = {
  /**
   * Instrument ID.
   *
   * e.g. ADA-USDT
   */
  instId: string;
}

type IOKXCancelLimitOrderInputParamsWithExchangeOrderId = {
  /**
   * Order ID provided by the exchange.
   */
  ordId: string;
} & IOKXCancelLimitOrderCommonInputParams;

type IOKXCancelLimitOrderInputParamsWithClientOrderId = {
  /**
   * Client-supplied order ID
   */
  clOrdId: string;
} & IOKXCancelLimitOrderCommonInputParams;


export type IOKXCancelLimitOrderInputParams =
  IOKXCancelLimitOrderInputParamsWithExchangeOrderId |
  IOKXCancelLimitOrderInputParamsWithClientOrderId
