import { Prisma } from '@opentrader/markets-prisma';

const marketTimeframe = Prisma.validator<Prisma.MarketTimeframeDefaultArgs>()(
  {},
);

export type MarketTimeframe = Prisma.MarketTimeframeGetPayload<
  typeof marketTimeframe
>;
