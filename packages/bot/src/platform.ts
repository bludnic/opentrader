import { findStrategy } from "@opentrader/bot-templates/server";
import { xprisma, type ExchangeAccountWithCredentials, TBotWithExchangeAccount } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { exchangeProvider } from "@opentrader/exchanges";
import { BotProcessing, getWatchers, shouldRunStrategy } from "@opentrader/processing";
import { eventBus } from "@opentrader/event-bus";
import { CandleEvent, OrderbookEvent, TickerEvent, TradeEvent } from "./channels/index.js";
import { processingQueue } from "./queue/index.js";
import { ProcessingEvent } from "./queue/types.js";

import { CandlesConsumer } from "./consumers/candles.consumer.js";
import { TradesConsumer } from "./consumers/trades.consumer.js";
import { OrderbookConsumer } from "./consumers/orderbook.consumer.js";
import { TickerConsumer } from "./consumers/ticker.consumer.js";
import { OrdersConsumer } from "./consumers/orders.consumer.js";

export class Platform {
  private ordersConsumer: OrdersConsumer;
  private candlesConsumer: CandlesConsumer;
  private tradesConsumer: TradesConsumer;
  private orderbookConsumer: OrderbookConsumer;
  private tickerConsumer: TickerConsumer;
  private unsubscribeFromEventBus = () => {};
  private enabledBots: TBotWithExchangeAccount[] = [];

  constructor(exchangeAccounts: ExchangeAccountWithCredentials[], bots: TBotWithExchangeAccount[]) {
    this.ordersConsumer = new OrdersConsumer(exchangeAccounts);

    this.candlesConsumer = new CandlesConsumer(bots);
    this.candlesConsumer.on("candle", ({ candle, history }: CandleEvent) =>
      this.handleProcess({ type: "onCandleClosed", candle, candles: history }),
    );

    this.tradesConsumer = new TradesConsumer(bots);
    this.tradesConsumer.on("trade", ({ trade }: TradeEvent) => this.handleProcess({ type: "onPublicTrade", trade }));

    this.orderbookConsumer = new OrderbookConsumer(bots);
    this.orderbookConsumer.on("orderbook", ({ orderbook }: OrderbookEvent) =>
      this.handleProcess({ type: "onOrderbookChange", orderbook }),
    );

    this.tickerConsumer = new TickerConsumer(bots);
    this.tickerConsumer.on("ticker", ({ ticker }: TickerEvent) =>
      this.handleProcess({ type: "onTickerChange", ticker }),
    );
  }

  async bootstrap() {
    await this.cleanOrphanedBots();

    logger.info("[Processor] OrdersProcessor created");
    await this.ordersConsumer.create();

    logger.info("[Processor] CandlesProcessor created");
    await this.candlesConsumer.create();

    logger.info("[Processor] TradesProcessor created");
    await this.tradesConsumer.create();

    logger.info("[Processor] OrderbookProcessor created");
    await this.orderbookConsumer.create();

    logger.info("[Processor] TickerProcessor created");
    await this.tickerConsumer.create();

    this.unsubscribeFromEventBus = this.subscribeToEventBus();
  }

  async shutdown() {
    await this.stopEnabledBots();

    logger.info("[Processor] OrdersProcessor destroyed");
    await this.ordersConsumer.destroy();

    logger.info("[Processor] CandlesProcessor destroyed");
    this.candlesConsumer.destroy();

    logger.info("[Processor] TradesProcessor destroyed");
    this.tradesConsumer.destroy();

    logger.info("[Processor] OrderbookProcessor destroyed");
    this.orderbookConsumer.destroy();

    logger.info("[Processor] TickerProcessor destroyed");
    this.tickerConsumer.destroy();

    this.unsubscribeFromEventBus();
  }

  /**
   * Stops enabled bots gracefully.
   * Does execute "stop" command on each bot, and then sets the bot status as disabled.
   */
  async stopEnabledBots() {
    const bots = await xprisma.bot.custom.findMany({
      where: { OR: [{ enabled: true }, { processing: true }] },
      include: { exchangeAccount: true },
    });
    if (bots.length === 0) return;
    logger.info(`[Processor] Stopping ${bots.length} bots gracefully…`);

    for (const bot of bots) {
      const botProcessor = new BotProcessing(bot);
      await botProcessor.processStopCommand();

      await xprisma.bot.custom.update({
        where: { id: bot.id },
        data: { enabled: false, processing: false },
      });

      logger.info(`[Processor] Bot stopped [id=${bot.id} name=${bot.name}]`);
    }
  }

  /**
   * When the app starts, check if there are any enabled bots and stop them gracefully.
   * This is necessary because the previous process might have been interrupted,
   * and there are open orders that need to be closed on the exchange.
   */
  async cleanOrphanedBots() {
    const anyBotEnabled = await xprisma.bot.custom.findFirst({
      where: { OR: [{ enabled: true }, { processing: true }] },
    });

    if (anyBotEnabled) {
      logger.warn(`[Processor] The previous process was interrupted, there are orphaned bots. Performing cleanup…`);
      await this.stopEnabledBots();
    }
  }

  /**
   * Subscribes to event bus events:
   *
   * - When a bot started → Subscribe to candles channel
   * - When a bot stopped → Unsubscribe from candles channel
   * - When an exchange account was created → Start watching for orders status change (filled, canceled, etc)
   * - When an exchange account was deleted → Stop watching for orders
   * - When an exchange account was updated → Resubcribe to orders channel with new credentials
   */
  private subscribeToEventBus() {
    const onBotStarted = async (bot: TBotWithExchangeAccount) => {
      const { strategyFn } = await findStrategy(bot.template);
      const { watchTrades, watchOrderbook, watchTicker, watchCandles } = getWatchers(strategyFn, bot);

      if (watchCandles.length > 0) await this.candlesConsumer.addBot(bot);
      if (watchTrades.length > 0) await this.tradesConsumer.addBot(bot);
      if (watchOrderbook.length > 0) await this.orderbookConsumer.addBot(bot);
      if (watchTicker.length > 0) await this.tickerConsumer.addBot(bot);

      this.enabledBots = await xprisma.bot.custom.findMany({
        where: { enabled: true },
        include: { exchangeAccount: true },
      });
    };

    const onBotStopped = async (bot: TBotWithExchangeAccount) => {
      this.enabledBots = await xprisma.bot.custom.findMany({
        where: { enabled: true },
        include: { exchangeAccount: true },
      });

      await this.candlesConsumer.cleanStaleChannels(this.enabledBots);
      await this.tradesConsumer.cleanStaleChannels(this.enabledBots);
      await this.orderbookConsumer.cleanStaleChannels(this.enabledBots);
      await this.tickerConsumer.cleanStaleChannels(this.enabledBots);
    };

    const addExchangeAccount = async (exchangeAccount: ExchangeAccountWithCredentials) =>
      await this.ordersConsumer.addExchangeAccount(exchangeAccount);

    const removeExchangeAccount = async (exchangeAccount: ExchangeAccountWithCredentials) => {
      await this.ordersConsumer.removeExchangeAccount(exchangeAccount);
      exchangeProvider.removeByAccountId(exchangeAccount.id);
    };

    const updateExchangeAccount = async (exchangeAccount: ExchangeAccountWithCredentials) => {
      exchangeProvider.removeByAccountId(exchangeAccount.id);
      await this.ordersConsumer.updateExchangeAccount(exchangeAccount);
    };

    eventBus.on("onBotStarted", onBotStarted);
    eventBus.on("onBotStopped", onBotStopped);
    eventBus.on("onExchangeAccountCreated", addExchangeAccount);
    eventBus.on("onExchangeAccountDeleted", removeExchangeAccount);
    eventBus.on("onExchangeAccountUpdated", updateExchangeAccount);

    // Return unsubscribe function
    return () => {
      eventBus.off("onBotStarted", onBotStarted);
      eventBus.off("onBotStopped", onBotStopped);
      eventBus.off("onExchangeAccountCreated", addExchangeAccount);
      eventBus.off("onExchangeAccountDeleted", removeExchangeAccount);
      eventBus.off("onExchangeAccountUpdated", updateExchangeAccount);
    };
  }

  async handleProcess(event: ProcessingEvent) {
    for (const bot of this.enabledBots) {
      const { strategyFn } = await findStrategy(bot.template);

      if (shouldRunStrategy(strategyFn, bot, event.type)) {
        processingQueue.push({
          ...event,
          bot,
        });
      }
    }
  }
}
