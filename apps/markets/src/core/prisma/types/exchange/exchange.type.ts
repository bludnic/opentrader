import { Prisma } from '@opentrader/markets-prisma';

const exchange = Prisma.validator<Prisma.ExchangeDefaultArgs>()({});

export type Exchange = Prisma.ExchangeGetPayload<typeof exchange>;
