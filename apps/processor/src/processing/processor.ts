import { ExchangeAccountsWatcher } from "./exchange-accounts.watcher";

export class Processor {
  private exchangeAccountsWatcher: ExchangeAccountsWatcher;

  constructor() {
    this.exchangeAccountsWatcher = new ExchangeAccountsWatcher();
  }

  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap: ExchangeAccountsWatcher -> create()");
    await this.exchangeAccountsWatcher.create();
  }

  async beforeApplicationShutdown() {
    console.log(
      "beforeApplicationShutdown: ExchangeAccountsWatcher -> destroy()",
    );
    await this.exchangeAccountsWatcher.destroy();
  }
}
