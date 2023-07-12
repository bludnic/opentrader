export interface IGetCandlesticksRequest {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
  bar?: '1m' | '3m' | '5m' | '15m' | '30m' | '1H' | '2H' | '4H';
  /**
   * Number of results per request.
   */
  limit?: number;
  before?: number;
  after?: number;
}
