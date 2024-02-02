import { TimeframeCron } from "./timeframe.cron";
import { ExchangeAccountsWatcher } from "./exchange-accounts.watcher";

export class Processor {
  private exchangeAccountsWatcher: ExchangeAccountsWatcher;
  private timeframeCron: TimeframeCron;

  constructor() {
    this.exchangeAccountsWatcher = new ExchangeAccountsWatcher();
    this.timeframeCron = new TimeframeCron();
  }

  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap: ExchangeAccountsWatcher -> create()");
    await this.exchangeAccountsWatcher.create();

    console.log("onApplicationBootstrap: TimeframeCron -> create()");
    this.timeframeCron.create();
  }

  async beforeApplicationShutdown() {
    console.log(
      "beforeApplicationShutdown: ExchangeAccountsWatcher -> destroy()",
    );
    await this.exchangeAccountsWatcher.destroy();

    console.log("onApplicationBootstrap: TimeframeCron -> destroy()");
    this.timeframeCron.destroy();
  }
}
