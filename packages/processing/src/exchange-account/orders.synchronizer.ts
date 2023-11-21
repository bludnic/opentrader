import { exchangeProvider, IExchange } from "@opentrader/exchanges";
import {
  ExchangeAccountWithCredentials,
  OrderWithSmartTrade,
  xprisma,
} from "@opentrader/db";
import type { IClosedOrder, IGetLimitOrderResponse } from "@opentrader/types";
import { OrderNotFound } from "ccxt";

type SyncBySymbolParams = {
  onFilled?: (exchangeOrder: IClosedOrder, order: OrderWithSmartTrade) => void;
  onCanceled?: (
    exchangeOrder: IClosedOrder,
    order: OrderWithSmartTrade,
  ) => void;
};

type SyncBySymbolResponse = {
  /**
   * If any order belonging to the bot was filled/canceled
   * the botId will be pushed to that array.
   */
  affectedBotsIds: number[];
  ordersStatusChangedCount: number;
};

export class OrdersSynchronizer {
  private exchangeAccount: ExchangeAccountWithCredentials;
  private exchange: IExchange;

  constructor(exchangeAccount: ExchangeAccountWithCredentials) {
    this.exchangeAccount = exchangeAccount;
    this.exchange = exchangeProvider.fromAccount(exchangeAccount);
  }

  async syncBySymbol(
    symbol: string,
    params?: SyncBySymbolParams,
  ): Promise<SyncBySymbolResponse> {
    const closedOrders = await this.exchange.getClosedOrders({
      symbol,
    });

    const affectedBotsIds: number[] = [];
    let ordersStatusChangedCount = 0;

    if (closedOrders.length === 0) {
      return {
        affectedBotsIds,
        ordersStatusChangedCount,
      };
    }

    const oldestExchangeOrder = closedOrders[0];

    const staleOrders = await xprisma.order.findMany({
      where: {
        status: "Placed",
        placedAt: {
          // Since we use `new Date()` for order placement time
          // The value from DB may be a little bit higher compared
          // to the real timestamp on the Exchange. That's why
          // an extra 1000ms was added.
          lte: new Date(oldestExchangeOrder.createdAt + 1000),
        },
        smartTrade: {
          bot: {
            enabled: true,
          },
        },
      },
      include: {
        smartTrade: true,
      },
      orderBy: {
        placedAt: "asc",
      },
    });
    if (staleOrders.length > 0) {
      console.log(`‼️ Found ${staleOrders.length} stale orders`);
      console.log(
        `  Oldest order in "exchange.closedOrders()" response ${new Date(
          oldestExchangeOrder.createdAt,
        ).toISOString()}`,
      );
      console.log("Stale orders", staleOrders);
    }
    for (const order of staleOrders) {
      const { exchangeOrder, statusChanged } = await this.syncStaleOrder(order);

      if (statusChanged) {
        ordersStatusChangedCount++;

        if (order.smartTrade.botId) {
          affectedBotsIds.push(order.smartTrade.botId);

          if (exchangeOrder.status === "filled") {
            params?.onFilled?.(exchangeOrder, order);
          } else if (exchangeOrder.status === "canceled") {
            params?.onCanceled?.(exchangeOrder, order);
          }
        } else {
          console.log(
            `❗ SmartTrade ${order.smartTrade.id} does not belong to any bot`,
          );
        }
      }
    }

    for (const exchangeOrder of closedOrders) {
      const order = await xprisma.order.findFirst({
        where: {
          exchangeOrderId: exchangeOrder.exchangeOrderId,
        },
        include: {
          smartTrade: true,
        },
      });

      // Check if exchange order is linked to any db order.
      // If `null` then the order was created by the user on Exchange,
      // so this order is not relevant.
      if (!order) continue;

      const orderStatusChanged = await this.syncClosedOrder(
        exchangeOrder,
        order,
      );

      if (orderStatusChanged) {
        ordersStatusChangedCount++;

        if (order.smartTrade.botId) {
          affectedBotsIds.push(order.smartTrade.botId);

          if (exchangeOrder.status === "filled") {
            params?.onFilled?.(exchangeOrder, order);
          } else if (exchangeOrder.status === "canceled") {
            params?.onCanceled?.(exchangeOrder, order);
          }
        } else {
          console.log(
            `❗ SmartTrade ${order.smartTrade.id} does not belong to any bot`,
          );
        }
      }
    }

    const affectedBotsIdsUnique = affectedBotsIds.filter(
      (value, index, array) => array.indexOf(value) === index,
    );

    return {
      affectedBotsIds: affectedBotsIdsUnique,
      ordersStatusChangedCount,
    };
  }

  /**
   * Returns `true` if order status changed.
   */
  private async syncClosedOrder(
    exchangeOrder: IClosedOrder,
    order: OrderWithSmartTrade,
  ): Promise<boolean> {
    await xprisma.order.updateSyncedAt(order.id);

    if (exchangeOrder.status === "filled") {
      const statusChanged = order.status !== "Filled";
      if (!statusChanged) return false;

      await xprisma.order.updateStatusToFilled({
        orderId: order.id,
        filledPrice: exchangeOrder.filledPrice,
        filledAt: new Date(exchangeOrder.lastTradeTimestamp),
        fee: exchangeOrder.fee,
      });

      console.log(
        `        -> Filled with price ${exchangeOrder.filledPrice} and fee ${exchangeOrder.fee}`,
      );

      return true;
    } else if (exchangeOrder.status === "canceled") {
      const statusChanged = order.status !== "Canceled";
      if (!statusChanged) return false;

      await xprisma.order.updateStatus("Canceled", order.id);
      console.log(`        -> Canceled`);

      return true;
    }

    return false;
  }

  /**
   * Returns `true` if order status changed.
   */
  private async syncStaleOrder(order: OrderWithSmartTrade): Promise<
    | {
        exchangeOrder: IGetLimitOrderResponse;
        statusChanged: true;
      }
    | {
        exchangeOrder: null;
        statusChanged: false;
      }
  > {
    if (!order.exchangeOrderId) {
      throw new Error("Order: Missing `exchangeOrderId`");
    }

    console.log(
      `    Sync ${order.side} stale order #${order.id}: exchangeOrderId "${order.exchangeOrderId}": price: ${order.price}: status: ${order.status}`,
    );

    try {
      const exchangeOrder = await this.exchange.getLimitOrder({
        orderId: order.exchangeOrderId,
        symbol: order.smartTrade.exchangeSymbolId,
      });

      await xprisma.order.updateSyncedAt(order.id);

      if (exchangeOrder.status === "filled") {
        const statusChanged = order.status !== "Filled";
        if (statusChanged) {
          await xprisma.order.updateStatusToFilled({
            orderId: order.id,
            filledPrice: exchangeOrder.filledPrice,
            filledAt: new Date(exchangeOrder.lastTradeTimestamp),
            fee: exchangeOrder.fee,
          });
          console.log(
            `        -> Filled with price ${exchangeOrder.filledPrice} and fee ${exchangeOrder.fee}`,
          );

          return { exchangeOrder, statusChanged: true };
        }
      } else if (exchangeOrder.status === "canceled") {
        const statusChanged = order.status !== "Canceled";
        if (statusChanged) {
          // Edge case: the user may cancel the order manually on the exchange
          await xprisma.order.updateStatus("Canceled", order.id);
          console.log(`        -> Canceled`);

          return { exchangeOrder, statusChanged: true };
        }
      }
    } catch (err) {
      if (err instanceof OrderNotFound) {
        await xprisma.order.updateStatus("Deleted", order.id);

        console.log(
          `        Order not found on the exchange. Status updated to "Deleted"`,
        );

        return { exchangeOrder: null, statusChanged: false };
      } else {
        throw err;
      }
    }

    return { exchangeOrder: null, statusChanged: false };
  }
}
