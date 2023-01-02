export interface IOKXGetCandlesticksInputParams {
  /**
   * 	Instrument ID, e.g. "ADA-USDT"
   */
  instId: string;
  /**
   * Bar size, the default is 1m
   */
  bar?: '1m' | '3m' | '5m' | '15m' | '30m' | '1H' | '2H' | '4H' | '1D';
  /**
   * Pagination of data to return records earlier than the requested `ts`
   */
  after?: string;
  /**
   * Pagination of data to return records newer than the requested `ts`
   */
  before?: string;
  /**
   * Number of results per request. The maximum is `300`. The default is `100`.
   */
  limit?: string;
}
