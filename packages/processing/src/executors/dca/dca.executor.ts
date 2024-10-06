import { xprisma } from "@opentrader/db";
import type { SmartTradeWithOrders } from "@opentrader/db";
import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { XEntityType, XOrderStatus } from "@opentrader/types";

import type { ISmartTradeExecutor } from "../smart-trade-executor.interface.js";
import { OrderExecutor } from "../order/order.executor.js";

export class DcaExecutor implements ISmartTradeExecutor {
  smartTrade: SmartTradeWithOrders;

  constructor(smartTrade: SmartTradeWithOrders) {
    this.smartTrade = smartTrade;
  }

  static create(smartTrade: SmartTradeWithOrders) {
    return new DcaExecutor(smartTrade);
  }

  static async fromId(id: number) {
    const smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });

    return new DcaExecutor(smartTrade);
  }

  static async fromOrderId(orderId: number) {
    const order = await xprisma.order.findUniqueOrThrow({
      where: {
        id: orderId,
      },
      include: {
        smartTrade: {
          include: {
            orders: true,
            exchangeAccount: true,
          },
        },
      },
    });

    return new DcaExecutor(order.smartTrade);
  }

  static async fromExchangeOrderId(exchangeOrderId: string) {
    const order = await xprisma.order.findFirstOrThrow({
      where: {
        exchangeOrderId,
      },
      include: {
        smartTrade: {
          include: {
            orders: true,
            exchangeAccount: true,
          },
        },
      },
    });

    return new DcaExecutor(order.smartTrade);
  }

  /**
   * Place both entry and take profit orders at the same time.
   */
  async next(): Promise<boolean> {
    const entryOrder = this.smartTrade.orders.find((order) => order.entityType === XEntityType.EntryOrder)!;
    const safetyOrders = this.smartTrade.orders.filter((order) => order.entityType === XEntityType.SafetyOrder);
    let takeProfitOrder = this.smartTrade.orders.find((order) => order.entityType === XEntityType.TakeProfitOrder)!;

    if (entryOrder.status === XOrderStatus.Idle) {
      const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
        where: { id: entryOrder.exchangeAccountId },
      });

      const orderExecutor = new OrderExecutor(
        entryOrder,
        exchangeProvider.fromAccount(exchangeAccount),
        entryOrder.symbol,
      );

      await orderExecutor.place();
      await this.pull();

      logger.info(
        `[DcaExecutor] ${entryOrder.type} entry order placed at price: ${entryOrder.price}. SmartTrade ID: ${this.smartTrade.id}`,
      );

      return true;
    }

    let safetyOrdersToBePlaced = safetyOrders.filter((order) => order.status === XOrderStatus.Idle);
    if (
      entryOrder.status === XOrderStatus.Filled &&
      (takeProfitOrder.status === XOrderStatus.Idle || safetyOrdersToBePlaced.length > 0)
    ) {
      const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
        where: { id: takeProfitOrder.exchangeAccountId },
      });

      // Update the TP order price based on entry price
      if (takeProfitOrder.status === XOrderStatus.Idle) {
        const newTakeProfitOrderPrice =
          entryOrder.filledPrice! + takeProfitOrder.relativePrice! * entryOrder.filledPrice!;

        takeProfitOrder = await xprisma.order.update({
          where: { id: takeProfitOrder.id },
          data: {
            ...takeProfitOrder,
            price: newTakeProfitOrderPrice,
          },
        });

        const orderExecutor = new OrderExecutor(
          takeProfitOrder,
          exchangeProvider.fromAccount(exchangeAccount),
          takeProfitOrder.symbol,
        );

        await orderExecutor.place();
        await this.pull();

        logger.info(
          `[DcaExecutor] TP order placed at price: ${takeProfitOrder.price}. SmartTrade ID: ${this.smartTrade.id}`,
        );
      }

      // Update safety orders prices and place the orders
      if (safetyOrdersToBePlaced.length > 0) {
        const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
          where: { id: entryOrder.exchangeAccountId },
        });
        logger.info(`[DcaExecutor] Placing ${safetyOrdersToBePlaced.length} Safety Orders...`);

        safetyOrdersToBePlaced = await Promise.all(
          safetyOrdersToBePlaced.map(async (order) => {
            const newPrice = entryOrder.filledPrice! + order.relativePrice! * entryOrder.filledPrice!;

            const updatedOrder = await xprisma.order.update({
              where: { id: order.id },
              data: {
                ...order,
                price: newPrice,
              },
            });

            return updatedOrder;
          }),
        );

        for (const order of safetyOrdersToBePlaced) {
          const orderExecutor = new OrderExecutor(order, exchangeProvider.fromAccount(exchangeAccount), order.symbol);

          await orderExecutor.place();
          await this.pull();

          logger.info(
            `[DcaExecutor] Safety order placed at price: ${order.price}. SmartTrade { id: ${this.smartTrade.id} }`,
          );
        }

        return true;
      }

      return true;
    }

    if (entryOrder.status === XOrderStatus.Filled && takeProfitOrder.status === XOrderStatus.Filled) {
      logger.info(
        `Nothing to do: Position is already closed { id: ${this.smartTrade.id}, entryOrderStatus: ${entryOrder.status}, takeProfitOrderStatus: ${takeProfitOrder?.status} }`,
      );

      // Cancel safety orders if any
      await this.cancelOrders();

      return false;
    }

    const filledSafetyOrders = safetyOrders.filter((order) => order.status === XOrderStatus.Filled);
    if (filledSafetyOrders.length > 0) {
      // calculating average entry price
      const totalCost =
        filledSafetyOrders.reduce((cost, order) => cost + order.quantity * order.filledPrice!, 0) +
        entryOrder.quantity * entryOrder.filledPrice!;
      const totalQty = filledSafetyOrders.reduce((qty, order) => qty + order.quantity, 0) + entryOrder.quantity;
      const entryPrice = totalCost / totalQty;

      const newTakeProfitPrice = entryPrice + entryPrice * takeProfitOrder.relativePrice!;
      logger.info(
        `[DcaExecutor] New take profit price is ${newTakeProfitPrice} (+${takeProfitOrder.relativePrice! * 100}%)`,
      );

      // Difference in price may also be used a marker that TP order must be modified
      if (totalQty > takeProfitOrder.quantity) {
        logger.info(`[DcaExecutor] One of Safety Orders was filled. Updating TP order...`);
        logger.info(`  Price: ${takeProfitOrder.price} -> ${newTakeProfitPrice}`);
        logger.info(`  Qty: ${takeProfitOrder.quantity} -> ${totalQty}`);

        const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
          where: { id: takeProfitOrder.exchangeAccountId },
        });
        const exchange = exchangeProvider.fromAccount(exchangeAccount);

        // Place a new TP order with a new price
        // The previous one will be canceled
        const orderExecutor = new OrderExecutor(takeProfitOrder, exchange, takeProfitOrder.symbol);
        await orderExecutor.modify({
          ...takeProfitOrder,
          price: newTakeProfitPrice,
          quantity: totalQty,
        });

        logger.info(`[DcaExecutor] Take Profit order updated successfully ID:${takeProfitOrder.id}`);
      }
    }

    return false;
  }

  /**
   * Cancel all orders linked to the smart trade.
   * Return number of cancelled orders.
   */
  async cancelOrders(): Promise<number> {
    const allOrders = [];

    for (const order of this.smartTrade.orders) {
      const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
        where: { id: order.exchangeAccountId },
      });
      const exchange = exchangeProvider.fromAccount(exchangeAccount);

      const orderExecutor = new OrderExecutor(order, exchange, order.symbol);

      const cancelled = await orderExecutor.cancel();
      allOrders.push(cancelled);
    }

    await xprisma.smartTrade.clearRef(this.smartTrade.id);
    await this.pull();

    const cancelledOrders = allOrders.filter((cancelled) => cancelled);
    logger.info(
      `[DcaExecutor] Orders were canceled: Position { id: ${this.smartTrade.id} }. Cancelled ${cancelledOrders.length} of ${allOrders.length} orders.`,
    );

    return cancelledOrders.length;
  }

  get status(): "Entering" | "Exiting" | "Finished" {
    const entryOrder = this.smartTrade.orders.find((order) => order.entityType === "EntryOrder")!;
    const takeProfitOrder = this.smartTrade.orders.find((order) => order.entityType === "TakeProfitOrder");

    if (entryOrder.status === "Idle" || entryOrder.status === "Placed") {
      return "Entering";
    }

    if (
      entryOrder.status === "Filled" &&
      (takeProfitOrder?.status === "Idle" || takeProfitOrder?.status === "Placed")
    ) {
      return "Exiting";
    }

    return "Finished";
  }

  /**
   * Pulls the order from the database to update the status.
   * Call directly only for testing.
   */
  async pull() {
    this.smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
      where: {
        id: this.smartTrade.id,
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });
  }
}
