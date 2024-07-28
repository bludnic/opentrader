import { xprisma, type ExchangeAccountWithCredentials, type TBot } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { exchangeProvider } from "@opentrader/exchanges";
import { BotProcessing } from "@opentrader/processing";
import { eventBus } from "@opentrader/event-bus";

import { CandlesProcessor } from "./candles.processor.js";
import { TimeframeCron } from "./timeframe.cron.js";
import { ExchangeAccountsWatcher } from "./exchange-accounts.watcher.js";

export class Processor {
  private exchangeAccountsWatcher: ExchangeAccountsWatcher;
  private timeframeCron: TimeframeCron;
  private candlesProcessor: CandlesProcessor;
  private unsubscribeFromEventBus = () => {};

  constructor(exchangeAccounts: ExchangeAccountWithCredentials[], bots: TBot[]) {
    this.exchangeAccountsWatcher = new ExchangeAccountsWatcher(exchangeAccounts);
    this.timeframeCron = new TimeframeCron();
    this.candlesProcessor = new CandlesProcessor(bots);
  }

  async onApplicationBootstrap() {
    logger.info("[Processor] OrdersProcessor created");
    await this.exchangeAccountsWatcher.create();

    // logger.info("[Processor] TimeframeProcessor created");
    // this.timeframeCron.create();

    logger.info("[Processor] CandlesProcessor created");
    await this.candlesProcessor.create();

    this.unsubscribeFromEventBus = this.subscribeToEventBus();
  }

  async beforeApplicationShutdown() {
    await this.stopAllBots();

    logger.info("[Processor] OrdersProcessor destroyed");
    await this.exchangeAccountsWatcher.destroy();

    // logger.info("[Processor] TimeframeProcessor destroyed");
    // this.timeframeCron.destroy();

    logger.info("[Processor] CandlesProcessor destroyed");
    this.candlesProcessor.destroy();

    this.unsubscribeFromEventBus();
  }

  async stopAllBots() {
    const bots = await xprisma.bot.custom.findMany({
      where: { enabled: true },
      include: { exchangeAccount: true },
    });
    logger.info(`[Processor] There a still ${bots.length} bots running, stopping them...`);

    for (const bot of bots) {
      const botProcessor = new BotProcessing(bot);
      await botProcessor.processStopCommand();

      await xprisma.bot.custom.update({
        where: { id: bot.id },
        data: { enabled: false },
      });

      logger.info(`[Processor] Bot stopped [id=${bot.id} name=${bot.name}]`);
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
    const onBotStarted = async (bot: TBot) => await this.candlesProcessor.addBot(bot);
    const onBotStopped = async (bot: TBot) => await this.candlesProcessor.cleanStaleChannels();

    const addExchangeAccount = async (exchangeAccount: ExchangeAccountWithCredentials) =>
      await this.exchangeAccountsWatcher.addExchangeAccount(exchangeAccount);

    const removeExchangeAccount = async (exchangeAccount: ExchangeAccountWithCredentials) => {
      await this.exchangeAccountsWatcher.removeExchangeAccount(exchangeAccount);
      exchangeProvider.removeByAccountId(exchangeAccount.id);
    };

    const updateExchangeAccount = async (exchangeAccount: ExchangeAccountWithCredentials) => {
      exchangeProvider.removeByAccountId(exchangeAccount.id);
      await this.exchangeAccountsWatcher.updateExchangeAccount(exchangeAccount);
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
}
