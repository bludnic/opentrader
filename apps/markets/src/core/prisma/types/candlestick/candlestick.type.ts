import { Prisma } from '@opentrader/markets-prisma';

const candlestick = Prisma.validator<Prisma.CandlestickDefaultArgs>()({});

export type Candlestick = Prisma.CandlestickGetPayload<typeof candlestick>;
