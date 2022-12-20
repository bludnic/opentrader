import { DOT_BUSD_DEALS_MOCK } from 'src/grid-bot/mocks/dotbusd-bot';
import { calculateInvestment } from 'src/grid-bot/utils/calculateInvestment';

describe('calculateInvestment', () => {
  it('should calculate investment', () => {
    const expectedResult = {
      baseCurrencyAmount: 120 + 120 + 120, // 3 Sell orders
      quoteCurrencyAmount: 120 / 10 + 120 / 12, // 2 Buy Orders
    };

    expect(calculateInvestment(DOT_BUSD_DEALS_MOCK, 120)).toStrictEqual(
      expectedResult,
    );
  });
});
