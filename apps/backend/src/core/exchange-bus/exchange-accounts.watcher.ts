import { IWatchOrder } from '@bifrost/types';
import { Injectable, Logger } from '@nestjs/common';
import { xprisma } from 'src/trpc/prisma';
import { OrderWithSmartTrade } from 'src/trpc/prisma/types/order/order-with-smart-trade';
import { OrderSynchronizerPollingWatcher } from './order-synchronizer/order-synchronizer-polling.watcher';
import { OrderSynchronizerWsWatcher } from './order-synchronizer/order-synchronizer-ws.watcher';

@Injectable()
export class ExchangeAccountsWatcher {
  private readonly logger = new Logger(ExchangeAccountsWatcher.name);
  private websocketWatchers: OrderSynchronizerWsWatcher[] = [];
  private pollingWatchers: OrderSynchronizerPollingWatcher[] = [];

  async create() {
    const exchangeAccounts = await xprisma.exchangeAccount.findMany();

    for (const exchangeAccount of exchangeAccounts) {
      // WebSocket watchers
      const wsWatcher = new OrderSynchronizerWsWatcher(exchangeAccount);
      this.websocketWatchers.push(wsWatcher);

      await wsWatcher.enable();
      wsWatcher.subscribe('onFilled', this.onOrderFilled.bind(this));
      wsWatcher.subscribe('onCanceled', this.onOrderCanceled.bind(this));

      // Polling watchers
      const pollingWatcher = new OrderSynchronizerPollingWatcher(
        exchangeAccount,
      );
      this.pollingWatchers.push(pollingWatcher);

      await pollingWatcher.enable();
      pollingWatcher.subscribe('onFilled', this.onOrderFilled.bind(this));
      pollingWatcher.subscribe('onCanceled', this.onOrderCanceled.bind(this));
    }
  }

  async destroy() {
    for (const watcher of this.websocketWatchers) {
      watcher.unsubscribeAll();
      await watcher.disable();
    }

    for (const watcher of this.pollingWatchers) {
      watcher.unsubscribeAll();
      await watcher.disable();
    }
  }

  private async onOrderFilled(
    exchangeOrder: IWatchOrder,
    order: OrderWithSmartTrade,
  ) {
    await xprisma.order.updateStatusToFilled({
      orderId: order.id,
      filledPrice: exchangeOrder.filledPrice,
    });
    this.logger.debug(
      `Order #${order.id} was filled with price ${exchangeOrder.filledPrice}`,
    );
  }

  private async onOrderCanceled(
    exchangeOrder: IWatchOrder,
    order: OrderWithSmartTrade,
  ) {
    // Edge case: the user may cancel the order manually on the exchange
    await xprisma.order.updateStatus('Canceled', order.id);
    this.logger.debug(`Updated status -> Canceled`);
  }
}
