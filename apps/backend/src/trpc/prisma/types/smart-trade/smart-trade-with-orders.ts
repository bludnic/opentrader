import { Prisma } from '@opentrader/prisma';

// @todo rename to SmartTradeFull or SmartTradeIncludeAll or SmartTradeIncludedFull
const smartTradeWithOrders = Prisma.validator<Prisma.SmartTradeDefaultArgs>()({
  include: {
    orders: true,
    exchangeAccount: true,
  },
});

export type SmartTradeWithOrders = Prisma.SmartTradeGetPayload<
  typeof smartTradeWithOrders
>;
