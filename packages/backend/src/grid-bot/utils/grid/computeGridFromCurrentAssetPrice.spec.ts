import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import {
  DOT_BUSD_BOT_WITH_NO_DEALS_MOCK,
  DOT_BUSD_CURRENT_ASSET_PRICE_MOCK,
  DOT_BUSD_GRID_INITIAL_GRID_LEVELS,
} from 'src/grid-bot/mocks/dotbusd-bot';
import { calcGridLines } from '@bifrost/tools';
import { computeGridFromCurrentAssetPrice } from './computeGridFromCurrentAssetPrice';
import { IGridBotLevel } from 'src/grid-bot/types/grid-bot-level.interface';

const bot: IGridBot = DOT_BUSD_BOT_WITH_NO_DEALS_MOCK;
const currentAssetPrice = DOT_BUSD_CURRENT_ASSET_PRICE_MOCK;

jest.mock('src/grid-bot/utils/orders/generateUniqClientOrderId');

describe('computeGridFromCurrentAssetPrice', () => {
  it('should calculate initial grid levels', () => {
    const gridLevels = computeGridFromCurrentAssetPrice(
      bot.gridLines,
      currentAssetPrice,
    );
    const expectedGridLevels: IGridBotLevel[] = DOT_BUSD_GRID_INITIAL_GRID_LEVELS;

    expect(gridLevels).toStrictEqual(expectedGridLevels);
  });

  it('check that the sell order price is calculated using big.js', () => {
    const currentAssetPrice = 1.13;
    const gridLines = calcGridLines(1.14, 1.11, 4, 5);

    const gridLevels = computeGridFromCurrentAssetPrice(
      gridLines,
      currentAssetPrice,
    );

    expect(gridLevels).toMatchObject([
      { sell: { price: 1.12 } },
      { sell: { price: 1.13 } }, // if not using big.js: 1.1300000000000001
      { sell: { price: 1.14 } },
    ]);
  });

  it('weird ETH/USDT', () => {
    const currentAssetPrice = 2610;
    const gridLines = calcGridLines(2800, 2500, 16, 0.1);

    const gridLevels = computeGridFromCurrentAssetPrice(
      gridLines,
      currentAssetPrice,
    );

    expect(gridLevels).toHaveLength(15);
    expect(gridLevels).toMatchObject([
      { buy: { price: 2500 } },
      { buy: { price: 2520 } },
      { buy: { price: 2540 } },
      { buy: { price: 2560 } },
      { buy: { price: 2580 } },
      { buy: { price: 2600 } },
      // current { sellOrder: { price: 2620 } },
      { sell: { price: 2640 } },
      { sell: { price: 2660 } },
      { sell: { price: 2680 } },
      { sell: { price: 2700 } },
      { sell: { price: 2720 } },
      { sell: { price: 2740 } },
      { sell: { price: 2760 } },
      { sell: { price: 2780 } },
      { sell: { price: 2800 } },
    ]);
  });

  it('weird NEAR/USDT', () => {
    const currentAssetPrice = 9.8;
    const gridLines = calcGridLines(12, 7.5, 10, 10);

    const gridLevels = computeGridFromCurrentAssetPrice(
      gridLines,
      currentAssetPrice,
    );

    expect(gridLevels).toHaveLength(9);
    expect(gridLevels).toMatchObject([
      { buy: { price: 7.5 } },
      { buy: { price: 8 } },
      { buy: { price: 8.5 } },
      { buy: { price: 9 } },
      { buy: { price: 9.5 } },
      // current { buyOrder: { price: 10 } },
      { sell: { price: 10.5 } },
      { sell: { price: 11 } },
      { sell: { price: 11.5 } },
      { sell: { price: 12 } },
    ]);
  });
});
