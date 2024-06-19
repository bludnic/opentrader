export interface IGetTradingFeeRatesRequest {
  /**
   * e.g. ADA
   */
  baseCurrency: string;
  /**
   * e.g. USDT
   */
  quoteCurrency: string;
}

export interface IGetTradingFeeRatesResponse {
  makerFee: number;
  takerFee: number;
}
