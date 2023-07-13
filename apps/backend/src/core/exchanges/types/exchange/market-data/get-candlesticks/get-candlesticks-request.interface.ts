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
  /**
   * Pagination of data to return records newer than the requested `ts`
   */
  before?: number;
  /**
   * Pagination of data to return records earlier than the requested `ts`
   */
  after?: number;
}
