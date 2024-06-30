import type { ExchangeAccountWithCredentials, TBot } from "@opentrader/db";
import { logger } from "@opentrader/logger";

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

  async onExchangeAccountCreated(
    exchangeAccount: ExchangeAccountWithCredentials,
  ) {
    await this.exchangeAccountsWatcher.addExchangeAccount(exchangeAccount);
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
