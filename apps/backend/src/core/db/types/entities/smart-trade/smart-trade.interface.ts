import { SmartBuyOrder, SmartSellOrder } from './orders/types';

export interface ISmartTrade {
  /**
   * Uniq generated ID
   */
  id: string;

  comment?: string;

  baseCurrency: string; // e.g 1INCH
  quoteCurrency: string; // e.g USDT

  buyOrder: SmartBuyOrder;
  // Note: Sell order is optional for a SmartTrade
  sellOrder: SmartSellOrder;

  quantity: number;

  // SmartTrade can be attached to a specific TradeBot
  // Set to `null` if it's an independent SmartTrade
  botId: string | null;

  createdAt: number;
  updatedAt: number;

  userId: string;
  exchangeAccountId: string;
}
