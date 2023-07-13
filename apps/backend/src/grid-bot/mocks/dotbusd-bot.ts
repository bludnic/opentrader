/**
 * Моки ботов для unit тестов.
 *
 * Стоит завести больше ботов с разными сценариями.
 */
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { exchangeAccountMock } from 'src/e2e/grid-bot/exchange-account';
import { user } from 'src/e2e/grid-bot/user';
import { IGridBotLevel } from '../types/grid-bot-level.interface';

export const DOT_BUSD_QUANTITY_PER_GRID = 20;

export const DOT_BUSD_SYMBOL = 'DOT-BUSD';

export const DOT_BUSD_CURRENT_ASSET_PRICE_MOCK = 14.5;

export const DOT_BUSD_GRID_LINES: IGridLine[] = [
  { price: 10, quantity: 20 },
  { price: 12, quantity: 20 },
  { price: 14, quantity: 20 },
  { price: 16, quantity: 20 },
  { price: 18, quantity: 20 },
  { price: 20, quantity: 20 },
];

export const DOT_BUSD_GRID_INITIAL_GRID_LEVELS: IGridBotLevel[] = [
  {
    buy: { price: 10, status: OrderStatusEnum.Idle, quantity: 20 },
    sell: { price: 12, status: OrderStatusEnum.Idle, quantity: 20 }
  },
  {
    buy: { price: 12, status: OrderStatusEnum.Idle, quantity: 20 },
    sell: { price: 14, status: OrderStatusEnum.Idle, quantity: 20 }
  },
  {
    buy: { price: 14, status: OrderStatusEnum.Filled, quantity: 20 },
    sell: { price: 16, status: OrderStatusEnum.Idle, quantity: 20 }
  },
  {
    buy: { price: 16, status: OrderStatusEnum.Filled, quantity: 20 },
    sell: { price: 18, status: OrderStatusEnum.Idle, quantity: 20 }
  },
  {
    buy: { price: 18, status: OrderStatusEnum.Filled, quantity: 20 },
    sell: { price: 20, status: OrderStatusEnum.Idle, quantity: 20 }
  },
]

export const DOT_BUSD_BOT_WITH_NO_DEALS_MOCK: IGridBot = {
  id: 'DOTBUSDBOT1',
  name: '[DOT/BUSD] Testing Bot #1',
  baseCurrency: 'DOT',
  quoteCurrency: 'BUSD',
  enabled: false,
  createdAt: 1643502168575,
  gridLines: DOT_BUSD_GRID_LINES,
  smartTrades: [],

  initialInvestment: {
    baseCurrency: {
      price: 15,
      quantity: 60,
    },
    quoteCurrency: {
      quantity: 290,
    },
  },

  userId: user.uid,
  exchangeAccountId: exchangeAccountMock.id,
};

export const DOT_BUSD_LIMIT_ORDERS_MOCK: IPlaceLimitOrderRequest[] = [
  {
    clientOrderId: 'DOTBUSD1B',
    price: 10,
    quantity: 20,
    side: OrderSideEnum.Buy,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD2B',
    price: 12,
    quantity: 20,
    side: OrderSideEnum.Buy,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD3S',
    price: 16,
    quantity: 20,
    side: OrderSideEnum.Sell,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD4S',
    price: 18,
    quantity: 20,
    side: OrderSideEnum.Sell,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD5S',
    price: 20,
    quantity: 20,
    side: OrderSideEnum.Sell,
    symbol: DOT_BUSD_SYMBOL,
  },
];
