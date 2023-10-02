import { Prisma } from '@opentrader/prisma';

const orderWithSmartTrade = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    smartTrade: true,
  },
});

export type OrderWithSmartTrade = Prisma.OrderGetPayload<
  typeof orderWithSmartTrade
>;
