import { Prisma } from "@prisma/client";

const orderWithSmartTrade = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    smartTrade: true,
  },
});

export type OrderWithSmartTrade = Prisma.OrderGetPayload<
  typeof orderWithSmartTrade
>;
