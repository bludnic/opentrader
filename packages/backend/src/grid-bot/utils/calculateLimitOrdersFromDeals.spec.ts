import {
  DOT_BUSD_BOT_WITH_NO_DEALS_MOCK,
  DOT_BUSD_DEALS_MOCK,
  DOT_BUSD_LIMIT_ORDERS_MOCK,
} from 'src/grid-bot/mocks/dotbusd-bot';
import { calculateLimitOrdersFromDeals } from 'src/grid-bot/utils/calculateLimitOrdersFromDeals';

describe('calculateLimitOrdersFromDeals', () => {
  it('should calculate limit orders from deals', () => {
    const bot = DOT_BUSD_BOT_WITH_NO_DEALS_MOCK;
    const deals = DOT_BUSD_DEALS_MOCK;
    const expectedLimitOrders = DOT_BUSD_LIMIT_ORDERS_MOCK;

    const limitOrders = calculateLimitOrdersFromDeals(deals, bot);

    expect(limitOrders).toStrictEqual(expectedLimitOrders);
  });
});
