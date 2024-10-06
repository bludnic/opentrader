import { XOrderStatus } from "@opentrader/types";
import type { PrismaClient } from "@prisma/client";

export const orderModel = (prisma: PrismaClient) => ({
  async findByExchangeOrderId(exchangeOrderId: string) {
    return prisma.order.findFirst({
      where: {
        exchangeOrderId,
      },
      include: {
        smartTrade: true,
      },
    });
  },
  async removeRef(orderId: number) {
    const resetSmartTradeRef = {
      update: {
        ref: null,
      },
    };
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        smartTrade: resetSmartTradeRef,
      },
    });
  },
  /**
   * This method is meant to just update the `status` in the DB when
   * synchronizing with the Exchange.
   */
  async updateStatus(status: Extract<XOrderStatus, "Canceled" | "Revoked" | "Deleted">, orderId: number) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });
  },
  async updateStatusToFilled(data: {
    orderId: number;
    filledPrice: number | null;
    filledAt: Date | null;
    fee: number | null;
  }) {
    const { orderId, filledPrice, filledAt, fee } = data;

    if (filledPrice === null) {
      throw new Error('Cannot update order status to "filled" without specifying "filledPrice"');
    }

    if (fee === null) {
      throw new Error('Cannot update order status to "filled" without specifying "fee"');
    }

    if (filledAt === null) {
      throw new Error('Cannot update order status to "filled" without specifying "filledAt"');
    }

    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "Filled",
        filledPrice,
        filledAt,
        fee,
      },
    });
  },
  async updateSyncedAt(orderId: number) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        syncedAt: new Date(),
      },
    });
  },
});
