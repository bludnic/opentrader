import type { ExchangeAccountWithCredentials } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { TimeframeCron } from "./timeframe.cron";
import { ExchangeAccountsWatcher } from "./exchange-accounts.watcher";

export class Processor {
  private exchangeAccountsWatcher: ExchangeAccountsWatcher;
  private timeframeCron: TimeframeCron;

  constructor(exchangeAccounts: ExchangeAccountWithCredentials[]) {
    this.exchangeAccountsWatcher = new ExchangeAccountsWatcher(
      exchangeAccounts,
    );
    this.timeframeCron = new TimeframeCron();
  }

  async onApplicationBootstrap() {
    logger.info("onApplicationBootstrap: ExchangeAccountsWatcher -> create()");
    await this.exchangeAccountsWatcher.create();

    logger.info("onApplicationBootstrap: TimeframeCron -> create()");
    this.timeframeCron.create();
  }

  async beforeApplicationShutdown() {
    logger.info(
      "beforeApplicationShutdown: ExchangeAccountsWatcher -> destroy()",
    );
    await this.exchangeAccountsWatcher.destroy();

    logger.info("onApplicationBootstrap: TimeframeCron -> destroy()");
    this.timeframeCron.destroy();
  }
}
