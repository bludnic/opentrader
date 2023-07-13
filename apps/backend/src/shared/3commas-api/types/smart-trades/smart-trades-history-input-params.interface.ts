import { SmartTradeOrderBy } from './enums/smart-trade-order-by.enum';
import { SmartTradeStatus } from './enums/smart-trade-status.enum';

export interface ISmartTradesHistoryInputParams {
  account_id?: number;
  pair?: string;
  type?: string;
  page?: number;
  per_page?: number;
  status?: SmartTradeStatus;
  order_by?: SmartTradeOrderBy;
  /**
   * Param for a filter by created date
   */
  from?: string;
  /**
   * Base currency
   */
  base?: string;
  /**
   * Quote currency
   */
  quote?: string;
}
