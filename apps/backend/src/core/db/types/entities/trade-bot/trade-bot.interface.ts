import { IOrder } from "./orders/order.interface";

export interface ITradeBot {
  id: string;
  name: string;
  baseCurrency: string; // e.g 1INCH
  quoteCurrency: string; // e.g USDT
  enabled: boolean;
  createdAt: number;
  orders: Record<string, IOrder>;

  userId: string;
  exchangeAccountId: string;
}