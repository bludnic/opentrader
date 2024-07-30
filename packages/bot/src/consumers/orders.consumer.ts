import type { IWatchOrder } from "@opentrader/types";
import { BotProcessing } from "@opentrader/processing";
import type { OrderWithSmartTrade, ExchangeAccountWithCredentials } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { OrdersChannel } from "../channels/index.js";
import { processingQueue } from "../queue/index.js";

export class OrdersConsumer {
  private channels: OrdersChannel[] = [];
  private initialExchangeAccounts: ExchangeAccountWithCredentials[];

  constructor(exchangeAccounts: ExchangeAccountWithCredentials[]) {
    this.initialExchangeAccounts = exchangeAccounts;
  }

  async create() {
    for (const exchangeAccount of this.initialExchangeAccounts) {
      await this.addExchangeAccount(exchangeAccount);
    }
  }

  async addExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    const watcherExists = this.channels.find((channel) => channel.exchangeAccount.id === exchangeAccount.id);
    if (watcherExists) {
      logger.error(`❗ Exchange account #${exchangeAccount.id} already exists in the ordersWatchers`);
      return;
    }

    const ordersWatcher = new OrdersChannel(exchangeAccount);
    this.channels.push(ordersWatcher);

    ordersWatcher.subscribe("onFilled", this.onOrderFilled.bind(this));
    ordersWatcher.subscribe("onCanceled", this.onOrderCanceled.bind(this));
    ordersWatcher.subscribe("onPlaced", this.onOrderPlaced.bind(this));

    await ordersWatcher.enable();

    logger.info(`🔋 Exchange account #${exchangeAccount.id} added to the ordersWatchers`);
  }

  async removeExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    const ordersChannel = this.channels.find((watcher) => watcher.exchangeAccount.id === exchangeAccount.id);

    if (!ordersChannel) {
      logger.error(`❗ Exchange account #${exchangeAccount.id} not found in the ordersWatchers`);
      return;
    }

    ordersChannel.unsubscribeAll();
    await ordersChannel.disable();

    // exclude the watcher from the list
    this.channels = this.channels.filter((channel) => channel.exchangeAccount.id !== exchangeAccount.id);

    logger.info(`🗑️ Exchange account #${exchangeAccount.id} removed from the ordersWatchers`);
  }

  async updateExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    await this.removeExchangeAccount(exchangeAccount);
    await this.addExchangeAccount(exchangeAccount);
  }

  async destroy() {
    for (const watcher of this.channels) {
      watcher.unsubscribeAll();
      await watcher.disable();
    }
  }

  private async onOrderFilled(exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) {
    logger.info(
      `🔋 onOrderFilled: Order #${order.id}: ${order.exchangeOrderId} was filled with price ${exchangeOrder.filledPrice} at ${exchangeOrder.lastTradeTimestamp} timestamp`,
    );
    await xprisma.order.updateStatusToFilled({
      orderId: order.id,
      filledPrice: exchangeOrder.filledPrice,
      filledAt: new Date(exchangeOrder.lastTradeTimestamp || Date.now()),
      fee: exchangeOrder.fee,
    });

    const botProcessor = await BotProcessing.fromSmartTradeId(order.smartTrade.id);

    if (botProcessor.isBotStopped()) {
      logger.error("❗ Cannot run bot process when the bot is disabled");
      return;
    }

    if (botProcessor.getTimeframe()) {
      logger.error(
        `❕ The bot #${botProcessor.getId()} is timeframe-based: ${botProcessor.getTimeframe()}. Skip processing`,
      );
      return;
    }

    processingQueue.push({
      type: "onOrderFilled",
      bot: botProcessor.getBot(),
      orderId: order.id,
    });
  }

  private async onOrderCanceled(exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) {
    // Edge case: the user may cancel the order manually on the exchange
    await xprisma.order.updateStatus("Canceled", order.id);
    logger.info(`❌  onOrderCanceled: Order #${order.id}: ${order.exchangeOrderId} was canceled`);
  }

  private async onOrderPlaced(exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) {
    // Edge case: the user could change the price of the order on the Exchange
    logger.info(`⬆️ onOrderPlaced: Order #${order.id}: ${order.exchangeOrderId}`);

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
