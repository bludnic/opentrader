import { ICompletedDealSellOrder } from './types/completed-deal-sell-order.interface';
import { ICompletedDealBuyOrder } from './types/completed-deal-buy-order.interface';

export interface ICompletedDeal {
  id: string;

  buyOrder: ICompletedDealBuyOrder;
  sellOrder: ICompletedDealSellOrder;

  createdAt: number; // timestamp
  botId: string;
}
