import { OKXBarSize } from 'src/core/exchanges/okx/types/client/market-data/common/bar-size.type';

export interface IOKXGetCandlesticksInputParams {
  /**
   * 	Instrument ID, e.g. "ADA-USDT"
   */
  instId: string;
  /**
   * Bar size, the default is 1m
   */
  bar?: OKXBarSize;
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
