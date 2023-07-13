import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { GridBotE2EDeal } from 'src/e2e/grid-bot/deals/types';
import {
  GridBotE2EActionOrder,
  GridBotE2ELimitOrder,
} from 'src/e2e/grid-bot/orders/types';

export type GridBotE2EHistoryData = {
  time: string;
  price: number; // current market price
  limitOrders: GridBotE2ELimitOrder[];
  deals: GridBotE2EDeal[];
  orders: GridBotE2EActionOrder[]; // orders to be placed
};

export type IGridBotSettings = Pick<
  IGridBot,
  'id' | 'name' | 'baseCurrency' | 'quoteCurrency' | 'gridLines'
>;
