import type { BarSize } from "src/common";

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
   * Return results since specified timestamp.
   */
  since?: number;
}
