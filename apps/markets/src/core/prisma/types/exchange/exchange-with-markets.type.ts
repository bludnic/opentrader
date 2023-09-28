import { Prisma } from '@bifrost/markets-prisma';

const exchangeWithMarketsType = Prisma.validator<Prisma.ExchangeDefaultArgs>()({
  include: {
    markets: true,
  },
});

export type ExchangeWithMarkets = Prisma.ExchangeGetPayload<
  typeof exchangeWithMarketsType
>;
