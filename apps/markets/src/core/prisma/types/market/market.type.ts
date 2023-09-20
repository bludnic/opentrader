import { Prisma } from '@bifrost/markets-prisma';

const market = Prisma.validator<Prisma.MarketDefaultArgs>()({});

export type Market = Prisma.MarketGetPayload<typeof market>;
