import { prisma } from "#db/prisma";

export const smartTradeModel = {
  async setRef(id: number, ref: string | null) {
    return prisma.smartTrade.update({
      where: {
        id,
      },
      data: {
        ref,
      },
    });
  },
  async findByExchangeOrderId(exchangeOrderId: string) {
    return prisma.smartTrade.findFirst({
      where: {
        orders: {
          some: {
            exchangeOrderId,
          },
        },
      },
      include: {
        orders: true,
      },
    });
  },
};
