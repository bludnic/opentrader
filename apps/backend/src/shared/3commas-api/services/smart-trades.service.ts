import {
  SmartTradeHistoryParams,
  SmartTradeParams,
} from '3commas-typescript/dist/types/types';
import { Order } from '3commas-typescript/src/types/generated-types';
import { API } from '3commas-typescript';

/**
 * @see https://github.com/3commas-io/3commas-official-api-docs/blob/master/smart_trades_v2_api.md
 */
export class SmartTradesService {
  constructor(
    private readonly threeCommasAPI: API,
  ) {}

  smartTradesHistory(params?: SmartTradeHistoryParams): Promise<Order[]> {
    return this.threeCommasAPI.getSmartTradeHistory();
  }

  createSmartTrade(params: SmartTradeParams): Promise<Order> {
    return this.threeCommasAPI.smartTrade(params);
  }
}
