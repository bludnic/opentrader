import { Injectable, Logger } from '@nestjs/common';
import { OrderSynchronizerWsWatcher } from 'src/core/exchange-bus/order-synchronizer-ws.watcher';
import { xprisma } from 'src/trpc/prisma';

@Injectable()
export class ExchangeAccountsWatcher {
  private readonly logger = new Logger(OrderSynchronizerWsWatcher.name);
  private watchers: OrderSynchronizerWsWatcher[] = [];

  async create() {
    const exchangeAccounts = await xprisma.exchangeAccount.findMany();

    for (const exchangeAccount of exchangeAccounts) {
      const watcher = new OrderSynchronizerWsWatcher(exchangeAccount);
      watcher.enable();

      this.watchers.push(watcher);
    }
  }

  async destroy() {
    for (const watcher of this.watchers) {
      await watcher.disable();
    }
  }
}
