import type { IWatchOrder } from "@opentrader/types";
import { BotProcessing } from "@opentrader/processing";
import type {
  OrderWithSmartTrade,
  ExchangeAccountWithCredentials,
} from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { processingQueue } from "./processing.queue";
import { OrderSynchronizer } from "./order-synchronizer";

export class ExchangeAccountsWatcher {
  private ordersWatchers: OrderSynchronizer[] = [];
  private exchangeAccounts: ExchangeAccountWithCredentials[];

  constructor(exchangeAccounts: ExchangeAccountWithCredentials[]) {
    this.exchangeAccounts = exchangeAccounts;
  }

  async create() {
    for (const exchangeAccount of this.exchangeAccounts) {
      await this.addExchangeAccount(exchangeAccount);
    }
  }

  async addExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    const ordersWatcher = new OrderSynchronizer(exchangeAccount);
    this.ordersWatchers.push(ordersWatcher);

    ordersWatcher.subscribe("onFilled", this.onOrderFilled.bind(this));
    ordersWatcher.subscribe("onCanceled", this.onOrderCanceled.bind(this));
    ordersWatcher.subscribe("onPlaced", this.onOrderPlaced.bind(this));

    await ordersWatcher.enable();
  }

  async destroy() {
    for (const watcher of this.ordersWatchers) {
      watcher.unsubscribeAll();
      await watcher.disable();
    }
  }

  private async onOrderFilled(
    exchangeOrder: IWatchOrder,
    order: OrderWithSmartTrade,
  ) {
    logger.info(
      `🔋 onOrderFilled: Order #${order.id}: ${order.exchangeOrderId} was filled with price ${exchangeOrder.filledPrice} at ${exchangeOrder.lastTradeTimestamp} timestamp`,
    );
    await xprisma.order.updateStatusToFilled({
      orderId: order.id,
      filledPrice: exchangeOrder.filledPrice,
      filledAt: new Date(exchangeOrder.lastTradeTimestamp || Date.now()),
      fee: exchangeOrder.fee,
    });

    const bot = await BotProcessing.fromSmartTradeId(order.smartTrade.id);

    if (bot.isBotStopped()) {
      logger.error("❗ Cannot run bot process when the bot is disabled");
      return;
    }

    if (bot.getTimeframe()) {
      logger.error(
        `❕ The bot #${bot.getId()} is timeframe-based: ${bot.getTimeframe()}. Skip processing`,
      );
      return;
    }

    processingQueue.push(order.smartTrade.id, () => {
      logger.info(`Task processed, ST: ${order.smartTrade.id}`);
    });
  }

  private async onOrderCanceled(
    exchangeOrder: IWatchOrder,
    order: OrderWithSmartTrade,
  ) {
    // Edge case: the user may cancel the order manually on the exchange
    await xprisma.order.updateStatus("Canceled", order.id);
    logger.info(
      `❌  onOrderCanceled: Order #${order.id}: ${order.exchangeOrderId} was canceled`,
    );
  }

  private async onOrderPlaced(
    exchangeOrder: IWatchOrder,
    order: OrderWithSmartTrade,
  ) {
    // Edge case: the user could change the price of the order on the Exchange
    logger.info(
      `⬆️ onOrderPlaced: Order #${order.id}: ${order.exchangeOrderId}`,
    );

    // Order was possibly replaced.
    // This means that the user changed the order price on the Exchange.
    // Or the actual order price after placement differs from the placed price.
    // It may happen if the Exchange striped some decimal points of the price.
    //
    // Important: If order is filled immediately after
    // changing the price, the Exchange will not notify
    // about this (Placed and Filled statuses).
    // The order will remain with status "open",
    // until it's status will be updated by REST API fallback.
    //
    // This behaviour is observed on the OKX exchange

    // It may be a mistake to compare the exact value
    // Maybe will be better to store the `placedPrice` in the db
    // and compare `exchangeOrder.price !== order.placedPrice;`
    const orderPriceChanged = exchangeOrder.price !== order.price;
    if (orderPriceChanged) {
      logger.warn(
        `    ⚠️ Price changed ${order.price} -> ${exchangeOrder.price}. User may changed the order price on the Exchange.`,
      );
    }
  }
}
