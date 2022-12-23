import { DealEntity } from 'src/core/db/types/entities/grid-bots/deals/deal.entity';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { exchangeAccountMock } from 'src/e2e/grid-bot/exchange-account';
import { user } from 'src/e2e/grid-bot/user';
import {
  DOT_BUSD_BOT_WITH_NO_DEALS_MOCK,
  DOT_BUSD_CURRENT_ASSET_PRICE_MOCK,
  DOT_BUSD_DEALS_MOCK,
} from 'src/grid-bot/mocks/dotbusd-bot';
import { calcInitialDealsByAssetPrice } from 'src/grid-bot/utils/deals/calcInitialDealsByAssetPrice';

const bot: IGridBot = DOT_BUSD_BOT_WITH_NO_DEALS_MOCK;
const currentAssetPrice = DOT_BUSD_CURRENT_ASSET_PRICE_MOCK;

describe('calcInitialDealsByAssetPrice', () => {
  it('should calculate initial deals', () => {
    const deals = calcInitialDealsByAssetPrice(bot, currentAssetPrice);
    const expectedDeals: DealEntity<IDeal>[] = DOT_BUSD_DEALS_MOCK;

    expect(deals).toStrictEqual(expectedDeals);
  });

  it('check that the sell order price is calculated using big.js', () => {
    const currentAssetPrice = 1.13;
    const bot: IGridBot = {
      id: 'ADAUSDTBOT1',
      name: '[ADA/USDT] Testing Bot #1',
      baseCurrency: 'ADA',
      quoteCurrency: 'USDT',
      gridLevels: 4,
      lowPrice: 1.11,
      highPrice: 1.14,
      quantityPerGrid: 5,
      enabled: false,
      createdAt: 1643502168575,
      deals: [],

      userId: user.uid,
      exchangeAccountId: exchangeAccountMock.id,
    };

    const deals = calcInitialDealsByAssetPrice(bot, currentAssetPrice);

    expect(deals).toMatchObject([
      { sellOrder: { price: 1.12 } },
      { sellOrder: { price: 1.13 } }, // if not using big.js: 1.1300000000000001
      { sellOrder: { price: 1.14 } },
    ]);
  });
});
