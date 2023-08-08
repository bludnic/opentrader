import { BarSize } from "src/common";

export interface IGetCandlesticksRequest {
  /**
   * e.g. ADA-USDT
   */
  symbol: string;
  bar?: BarSize;
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
