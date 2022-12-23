import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import {
  DOT_BUSD_BUY_FILLED_DEAL,
  DOT_BUSD_BUY_PLACED_DEAL,
  DOT_BUSD_DEALS_MOCK,
  DOT_BUSD_SELL_FILLED_DEAL,
  DOT_BUSD_SELL_PLACED_DEAL,
} from 'src/grid-bot/mocks/dotbusd-bot';
import { recalculateDeals } from 'src/grid-bot/utils/recalculateDeals';

describe('recalculateDeals', () => {
  it('should ignore placed deals and return the same object', () => {
    const deals = DOT_BUSD_DEALS_MOCK;
    const newDeals = recalculateDeals(deals);

    expect(newDeals).toStrictEqual(deals);
  });

  it('should recalculate invalid deal statuses', () => {
    const deals: IDeal[] = [
      DOT_BUSD_BUY_FILLED_DEAL,
      DOT_BUSD_SELL_FILLED_DEAL,
    ];
    const newDeals = recalculateDeals(deals);

    const expectedNewDeals: IDeal[] = [
      DOT_BUSD_SELL_PLACED_DEAL,
      DOT_BUSD_BUY_PLACED_DEAL,
    ];

    expect(newDeals).toStrictEqual(expectedNewDeals);
  });
});
