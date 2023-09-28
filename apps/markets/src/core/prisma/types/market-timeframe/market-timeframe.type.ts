import { Prisma } from '@bifrost/markets-prisma';

const marketTimeframe = Prisma.validator<Prisma.MarketTimeframeDefaultArgs>()(
  {},
);

export type MarketTimeframe = Prisma.MarketTimeframeGetPayload<
  typeof marketTimeframe
>;
