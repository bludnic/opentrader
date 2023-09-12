import { Prisma } from '@bifrost/prisma';

const smartTradeWithOrders = Prisma.validator<Prisma.SmartTradeDefaultArgs>()({
  include: {
    orders: true,
  },
});

export type SmartTradeWithOrders = Prisma.SmartTradeGetPayload<
  typeof smartTradeWithOrders
>;
