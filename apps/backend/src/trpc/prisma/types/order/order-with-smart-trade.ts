import { Prisma } from '@bifrost/prisma';

const orderWithSmartTrade = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    smartTrade: true,
  },
});

export type OrderWithSmartTrade = Prisma.OrderGetPayload<
  typeof orderWithSmartTrade
>;
