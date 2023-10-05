import { IWatchOrder } from '@opentrader/types';
import { Injectable, Logger } from '@nestjs/common';
import { GridBotProcessor } from '@opentrader/processing';
import { xprisma, OrderWithSmartTrade } from '@opentrader/db';
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
      `onOrderFilled: Order #${order.id}: ${order.exchangeOrderId} was filled with price ${exchangeOrder.filledPrice}`,
    );

    const bot = await GridBotProcessor.fromSmartTradeId(order.smartTrade.id);

    // @todo minor feature:
    // 1. Make an async queue to guarantee template execution
    // on every order filled event.
    // 2. OR cancel somehow current process, and run it again.
    await bot.process();
  }

  private async onOrderCanceled(
    exchangeOrder: IWatchOrder,
    order: OrderWithSmartTrade,
  ) {
    // Edge case: the user may cancel the order manually on the exchange
    await xprisma.order.updateStatus('Canceled', order.id);
    this.logger.debug(
      `onOrderCanceled: Order #${order.id}: ${order.exchangeOrderId} was canceled`,
    );
  }
}
