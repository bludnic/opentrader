export interface IGetCandlesticksRequest {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
  bar?: '5m' | '15m' | '30m' | '1H' | '2H' | '4H' | '1D';
  /**
   * Number of results per request.
   */
  limit?: number;
}
