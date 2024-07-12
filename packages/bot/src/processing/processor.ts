import type { ExchangeAccountWithCredentials, TBot } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { exchangeProvider } from "@opentrader/exchanges";

import { CandlesProcessor } from "./candles.processor.js";
import { TimeframeCron } from "./timeframe.cron.js";
import { ExchangeAccountsWatcher } from "./exchange-accounts.watcher.js";

export class Processor {
  private exchangeAccountsWatcher: ExchangeAccountsWatcher;
  private timeframeCron: TimeframeCron;
  private candlesProcessor: CandlesProcessor;

  constructor(
    exchangeAccounts: ExchangeAccountWithCredentials[],
    bots: TBot[],
  ) {
    this.exchangeAccountsWatcher = new ExchangeAccountsWatcher(
      exchangeAccounts,
    );
    this.timeframeCron = new TimeframeCron();
    this.candlesProcessor = new CandlesProcessor(bots);
  }

  async addExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    await this.exchangeAccountsWatcher.addExchangeAccount(exchangeAccount);
  }

  async removeExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    await this.exchangeAccountsWatcher.removeExchangeAccount(exchangeAccount);
    exchangeProvider.removeByAccountId(exchangeAccount.id);
  }

  async updateExchangeAccount(exchangeAccount: ExchangeAccountWithCredentials) {
    exchangeProvider.removeByAccountId(exchangeAccount.id);
    await this.exchangeAccountsWatcher.updateExchangeAccount(exchangeAccount);
  }

  async onBotStarted(bot: TBot) {
    await this.candlesProcessor.addBot(bot);
  }

  async onApplicationBootstrap() {
    logger.info("[Processor] OrdersProcessor created");
    await this.exchangeAccountsWatcher.create();

    // logger.info("[Processor] TimeframeProcessor created");
    // this.timeframeCron.create();

    logger.info("[Processor] CandlesProcessor created");
    await this.candlesProcessor.create();
  }

  async beforeApplicationShutdown() {
    logger.info("[Processor] OrdersProcessor destroyed");
    await this.exchangeAccountsWatcher.destroy();

    // logger.info("[Processor] TimeframeProcessor destroyed");
    // this.timeframeCron.destroy();

    logger.info("[Processor] CandlesProcessor destroyed");
    this.candlesProcessor.destroy();
  }
}
