import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { InitialInvestment } from 'src/core/db/types/entities/grid-bots/investment/initial-investment.interface';
import {
  DOT_BUSD_BOT_WITH_NO_DEALS_MOCK,
  DOT_BUSD_CURRENT_ASSET_PRICE_MOCK,
  DOT_BUSD_GRID_LINES,
} from 'src/grid-bot/mocks/dotbusd-bot';
import { calcInitialInvestmentByGridLines } from './calcInitialInvestmentByGridLines';

describe('calcInitialInvestmentByGridLines', () => {
  it('should calculate initial investment', () => {
    const gridLines: IGridLine[] = DOT_BUSD_GRID_LINES.map((gridLine) => ({
      ...gridLine,
      quantity: 120,
    }));

    const bot = DOT_BUSD_BOT_WITH_NO_DEALS_MOCK;
    const currentAssetPrice = DOT_BUSD_CURRENT_ASSET_PRICE_MOCK;

    const expected: InitialInvestment = {
      baseCurrency: {
        quantity: 120 + 120 + 120, // 3 Sell orders
        price: currentAssetPrice,
      },
      quoteCurrency: {
        quantity: 120 * 10 + 120 * 12, // 2 Buy Orders
      },
    };

    expect(
      calcInitialInvestmentByGridLines(gridLines, currentAssetPrice),
    ).toEqual(expected);
  });
});
