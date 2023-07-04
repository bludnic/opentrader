type IOKXGetLimitOrderCommonInputParams = {
  /**
   * Instrument ID, e.g. `BTC-USD`
   */
  instId: string;
}

type IOKXGetLimitOrderInputParamsWithExchangeOrderId = {
  /**
   * Order ID provided by the exchange.
   */
  ordId: string;
} & IOKXGetLimitOrderCommonInputParams;

type IOKXGetLimitOrderInputParamsWithClientOrderId = {
  /**
   * Client-supplied order ID.
   *
   * A combination of case-sensitive alphanumerics, all numbers, or all letters of up to 32 characters.
   */
  clOrdId: string;
} & IOKXGetLimitOrderCommonInputParams;

export type IOKXGetLimitOrderInputParams =
  IOKXGetLimitOrderInputParamsWithExchangeOrderId |
  IOKXGetLimitOrderInputParamsWithClientOrderId
