import { OrderNotFound } from "ccxt";
import type {
  ExchangeAccountWithCredentials,
  OrderWithSmartTrade,
  $Enums,
} from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { exchangeProvider, type IExchange } from "@opentrader/exchanges";
import type { IGetLimitOrderResponse } from "@opentrader/types";
import { logger } from "@opentrader/logger";
import { toDbStatus } from "../utils";

type SymbolId = string;

type SyncOrdersParams = {
  onFilled?: (
    exchangeOrder: IGetLimitOrderResponse,
    order: OrderWithSmartTrade,
  ) => void;
  onCanceled?: (
    exchangeOrder: IGetLimitOrderResponse,
    order: OrderWithSmartTrade,
  ) => void;
};

export class ExchangeAccountProcessor {
  private exchangeAccount: ExchangeAccountWithCredentials;
  private exchange: IExchange;

  private cachedOrders: Partial<Record<SymbolId, IGetLimitOrderResponse[]>> =
    {};

  constructor(exchangeAccount: ExchangeAccountWithCredentials) {
    this.exchangeAccount = exchangeAccount;
    this.exchange = exchangeProvider.fromAccount(exchangeAccount);
  }

  async syncOrders(params?: SyncOrdersParams) {
    const affectedBotsIds: number[] = [];

    // Find all placed orders of current enabled bots
    const orders = await xprisma.order.findMany({
      where: {
        status: "Placed",
        smartTrade: {
          exchangeAccount: {
            id: this.exchangeAccount.id,
          },
          bot: {
            enabled: true,
          },
        },
      },
      include: {
        smartTrade: true,
      },
    });

    if (orders.length === 0) {
      logger.debug("ExchangeAccountProcessor: No orders in DB to synchronize");
      return {
        affectedBotsIds,
      };
    }

    logger.info(
      `ExchangeAccountProcessor: Preparing ${orders.length} orders for synchronization`,
    );

    for (const order of orders) {
      const { statusChanged, newStatus, exchangeOrder } =
        await this.fetchExchangeOrder(order);

      if (statusChanged) {
        await this.updateStatus(order, exchangeOrder, newStatus);

        if (exchangeOrder.status === "filled") {
          params?.onFilled?.(exchangeOrder, order);
        } else if (exchangeOrder.status === "canceled") {
          params?.onCanceled?.(exchangeOrder, order);
        }

        if (order.smartTrade.botId) {
          affectedBotsIds.push(order.smartTrade.botId);
        }
      }
    }

    return {
      affectedBotsIds: affectedBotsIds.filter(
        (value, index, array) => array.indexOf(value) === index,
      ),
    };
  }

  private async fetchExchangeOrder(order: OrderWithSmartTrade) {
    try {
      const exchangeOrder = await this.fetchClosedOrder(order);

      const exchangeOrderStatus = toDbStatus(exchangeOrder.status);
      const statusChanged = order.status !== exchangeOrderStatus;

      await xprisma.order.updateSyncedAt(order.id);

      return {
        exchangeOrder,
        newStatus: exchangeOrderStatus,
        statusChanged,
      };
    } catch (err) {
      if (err instanceof OrderNotFound) {
        return {
          exchangeOrder: null,
          newStatus: "Deleted",
        };
      }
      throw err;
    }
  }

  private async updateStatus(
    order: OrderWithSmartTrade,
    exchangeOrder: IGetLimitOrderResponse,
    status: $Enums.OrderStatus,
  ) {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- "Idle" | "Placed" | "Revoked" doesn't require to be processed
    switch (status) {
      case "Filled":
        await xprisma.order.updateStatusToFilled({
          orderId: order.id,
          filledPrice: exchangeOrder.filledPrice,
          filledAt: new Date(exchangeOrder.lastTradeTimestamp),
          fee: exchangeOrder.fee,
        });
        logger.info(
          `        -> Filled with price ${exchangeOrder.filledPrice} and fee ${exchangeOrder.fee}`,
        );

        return;
      case "Canceled":
        await xprisma.order.updateStatus("Canceled", order.id);
        logger.info(`        -> Canceled`);

        return;
      case "Deleted":
        await xprisma.order.updateStatus("Deleted", order.id);

        logger.info(
          `        Order not found on the exchange. Status updated to "Deleted"`,
        );
    }
  }

  private async fetchClosedOrder(order: OrderWithSmartTrade) {
    const symbol = order.smartTrade.exchangeSymbolId;

    const cachedOrder = await this.findFromCache(order);
    if (cachedOrder) {
      return cachedOrder;
    }

    logger.warn(
      `Order ${order.id}:${order.exchangeOrderId} not found in Open/Closed orders list. Fetching from exchange.`,
    );
    const exchangeOrder = await this.exchange.getLimitOrder({
      symbol,
      orderId: order.exchangeOrderId!, // @todo assertHasExchangeOrderId
    });
    return exchangeOrder;
  }

  private async findFromCache(order: OrderWithSmartTrade) {
    const symbol = order.smartTrade.exchangeSymbolId;

    const cachedOrders = await this.getOrders(symbol);
    const cachedOrder = cachedOrders.find(
      (exchangeOrder) =>
        exchangeOrder.exchangeOrderId === order.exchangeOrderId,
    );

    return cachedOrder;
  }

  private async getOrders(symbol: string) {
    const cachedOrders = this.cachedOrders[symbol];
    if (cachedOrders) {
      return cachedOrders;
    }

    logger.info(`Fetching open orders of ${symbol} symbol`);
    const openOrders = await this.exchange.getOpenOrders({
      symbol,
    });

    logger.info(`Fetching closed orders of ${symbol} symbol`);
    const closedOrders = await this.exchange.getClosedOrders({
      symbol,
    });

    logger.info(
      `Open Orders: ${openOrders.length}: Closed Orders: ${closedOrders.length}`,
    );
    const orders = [...closedOrders, ...openOrders];
    this.cachedOrders[symbol] = orders;

    return orders;
  }
}
