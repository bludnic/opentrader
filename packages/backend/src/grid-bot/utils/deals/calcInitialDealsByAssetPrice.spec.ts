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

jest.mock('src/grid-bot/utils/orders/generateUniqClientOrderId');

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

  it('weird ETH/USDT', () => {
    const bot: IGridBot = {
      id: 'ETHUSDTBOT1',
      name: '[ETH/USDT] Testing Bot #2',
      baseCurrency: 'ETH',
      quoteCurrency: 'USDT',
      gridLevels: 16,
      lowPrice: 2500,
      highPrice: 2800,
      quantityPerGrid: 0.1,
      enabled: false,
      createdAt: 1643502168575,

      deals: [],
      userId: user.uid,
      exchangeAccountId: exchangeAccountMock.id,
    };

    const currentAssetPrice = 2610;
    const deals = calcInitialDealsByAssetPrice(bot, currentAssetPrice);

    expect(deals).toHaveLength(15);
    expect(deals).toMatchObject([
      { buyOrder: { price: 2500 } },
      { buyOrder: { price: 2520 } },
      { buyOrder: { price: 2540 } },
      { buyOrder: { price: 2560 } },
      { buyOrder: { price: 2580 } },
      { buyOrder: { price: 2600 } },
      // current { sellOrder: { price: 2620 } },
      { sellOrder: { price: 2640 } },
      { sellOrder: { price: 2660 } },
      { sellOrder: { price: 2680 } },
      { sellOrder: { price: 2700 } },
      { sellOrder: { price: 2720 } },
      { sellOrder: { price: 2740 } },
      { sellOrder: { price: 2760 } },
      { sellOrder: { price: 2780 } },
      { sellOrder: { price: 2800 } },
    ]);
  });

  it('weird NEAR/USDT', () => {
    const bot: IGridBot = {
      id: 'NEARUSDT1',
      name: 'NEAR Long Bot',
      baseCurrency: 'NEAR',
      quoteCurrency: 'USDT',
      gridLevels: 10,
      lowPrice: 7.5,
      highPrice: 12,
      quantityPerGrid: 10,
      enabled: false,
      createdAt: 1643502168575,

      deals: [],
      userId: user.uid,
      exchangeAccountId: exchangeAccountMock.id,
    };

    const currentAssetPrice = 9.8;
    const deals = calcInitialDealsByAssetPrice(bot, currentAssetPrice);

    expect(deals).toHaveLength(9);
    expect(deals).toMatchObject([
      { buyOrder: { price: 7.5 } },
      { buyOrder: { price: 8 } },
      { buyOrder: { price: 8.5 } },
      { buyOrder: { price: 9 } },
      { buyOrder: { price: 9.5 } },
      // current { buyOrder: { price: 10 } },
      { sellOrder: { price: 10.5 } },
      { sellOrder: { price: 11 } },
      { sellOrder: { price: 11.5 } },
      { sellOrder: { price: 12 } },
    ]);
  });
});
