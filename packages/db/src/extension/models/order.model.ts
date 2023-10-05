import { $Enums } from "@opentrader/prisma";
import { prisma } from "#db/prisma";

export const orderModel = {
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
  /**
   * This method is meant to just update the `status` in the DB when
   * synchronizing with the Exchange.
   */
  async updateStatus(
    status: Extract<$Enums.OrderStatus, "Canceled" | "Revoked" | "Deleted">,
    orderId: number,
  ) {
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
        status,
        smartTrade: resetSmartTradeRef,
      },
    });
  },
  async updateStatusToFilled(data: {
    orderId: number;
    filledPrice: number | null;
  }) {
    const { orderId, filledPrice } = data;

    if (filledPrice === null) {
      throw new Error(
        'Cannot update order status to "filled" without specifying "filledPrice"',
      );
    }

    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "Filled",
        filledPrice,
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
};
