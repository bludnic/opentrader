/**
 * Моки ботов для unit тестов.
 *
 * Стоит завести больше ботов с разными сценариями.
 */
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { exchangeAccountMock } from 'src/e2e/grid-bot/exchange-account';
import { user } from 'src/e2e/grid-bot/user';

export const DOT_BUSD_CURRENT_ASSET_PRICE_MOCK = 14.5;

export const DOT_BUSD_GRID_LINES: IGridLine[] = [
  { price: 10, quantity: 20 },
  { price: 12, quantity: 20 },
  { price: 14, quantity: 20 },
  { price: 16, quantity: 20 },
  { price: 18, quantity: 20 },
  { price: 20, quantity: 20 },
];

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
