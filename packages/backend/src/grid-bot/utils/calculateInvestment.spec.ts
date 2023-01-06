import { DOT_BUSD_DEALS_MOCK } from 'src/grid-bot/mocks/dotbusd-bot';
import { calculateInvestment } from 'src/grid-bot/utils/calculateInvestment';

describe('calculateInvestment', () => {
  it('should calculate investment', () => {
    const expectedResult = {
      baseCurrencyAmount: 120 + 120 + 120, // 3 Sell orders
      quoteCurrencyAmount: 120 * 10 + 120 * 12, // 2 Buy Orders
    };

    const deals = DOT_BUSD_DEALS_MOCK.map((deal) => ({
      ...deal,
      quantity: 120,
    }));

    expect(calculateInvestment(deals)).toStrictEqual(expectedResult);
  });
});
