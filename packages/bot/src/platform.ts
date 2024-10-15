import { findStrategy, loadCustomStrategies } from "@opentrader/bot-templates/server";
import { xprisma, type ExchangeAccountWithCredentials, TBotWithExchangeAccount } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { exchangeProvider } from "@opentrader/exchanges";
import { BotProcessing, getWatchers, shouldRunStrategy } from "@opentrader/processing";
import { eventBus } from "@opentrader/event-bus";
import { store } from "@opentrader/bot-store";
import { MarketEvent, MarketId } from "@opentrader/types";
import { processingQueue } from "./queue/index.js";

import { MarketsStream } from "./streams/markets.stream.js";
import { OrdersStream } from "./streams/orders.stream.js";

export class Platform {
  private ordersConsumer;
  private marketStream: MarketsStream;
  private unsubscribeFromEventBus = () => {};
  private enabledBots: TBotWithExchangeAccount[] = [];

  constructor(exchangeAccounts: ExchangeAccountWithCredentials[], bots: TBotWithExchangeAccount[]) {
    this.ordersConsumer = new OrdersStream(exchangeAccounts);

    this.marketStream = new MarketsStream(this.enabledBots);
    this.marketStream.on("market", this.handleMarketEvent);
  }

  async bootstrap() {
    const customStrategiesPath = process.env.CUSTOM_STRATEGIES_PATH;
    if (customStrategiesPath) await this.loadCustomStrategies(customStrategiesPath);

    await this.cleanOrphanedBots();
    await this.ordersConsumer.create();
    await this.marketStream.create();

    this.unsubscribeFromEventBus = this.subscribeToEventBus();
  }

  async shutdown() {
    await this.stopEnabledBots();

    await this.ordersConsumer.destroy();

    this.marketStream.off("market", this.handleMarketEvent);
    this.marketStream.destroy();

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
      // Check if the strategy function exists
      // If not, just mark the bot as disabled
      try {
        findStrategy(bot.template);
      } catch (err) {
        logger.warn(
          `[Processor] Strategy "${bot.template}" not found. ` +
            "The strategy may have been removed, or the CUSTOM_STRATEGIES_PATH env is incorrect. " +
            `Marking the bot as disabled [Bot ID: ${bot.id}, Name: ${bot.name}]`,
        );

        await xprisma.bot.custom.update({
          where: { id: bot.id },
          data: { enabled: false, processing: false },
        });

        continue;
      }

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
   * Loads custom strategies from the specified directory.
   * @param fullPath Absolute path to the directory with custom strategies
   */
  async loadCustomStrategies(fullPath: string) {
    logger.info(`Loading custom strategies from dir: ${fullPath}`);
    const customStrategies = await loadCustomStrategies(fullPath);
    const customStrategiesCount = Object.keys(customStrategies).length;

    if (customStrategiesCount > 0) {
      logger.info(`Loaded ${customStrategiesCount} custom strategies`);
    } else {
      logger.warn("No custom strategies found");
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
      this.marketStream.add(bot);

      this.enabledBots.push(bot);
    };

    const onBotStopped = async (bot: TBotWithExchangeAccount) => {
      this.enabledBots = this.enabledBots.filter((b) => b.id !== bot.id);

      await this.marketStream.clean(this.enabledBots);
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

  handleMarketEvent = (event: MarketEvent) => {
    store.updateMarket(event);

    for (const bot of this.enabledBots) {
      const { strategyFn } = findStrategy(bot.template);
      const { watchOrderbook, watchCandles, watchTrades, watchTicker } = getWatchers(strategyFn, bot);

      const isWatchingOrderbook = event.type === "onOrderbookChange" && watchOrderbook.includes(event.marketId);
      const isWatchingTicker = event.type === "onTickerChange" && watchTicker.includes(event.marketId);
      const isWatchingTrades = event.type === "onPublicTrade" && watchTrades.includes(event.marketId);
      const isWatchingCandles = event.type === "onCandleClosed" && watchCandles.includes(event.marketId);
      const isWatchingAny = isWatchingOrderbook || isWatchingTicker || isWatchingTrades || isWatchingCandles;

      const subscribedMarkets = [
        ...new Set([...watchOrderbook, ...watchCandles, ...watchTrades, ...watchTicker]),
      ] as MarketId[];

      if (isWatchingAny && shouldRunStrategy(strategyFn, bot, event.type)) {
        processingQueue.push({
          ...event,
          bot,
          subscribedMarkets,
        });
      }
    }
  };
}
