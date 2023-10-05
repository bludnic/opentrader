import { Logger } from '@nestjs/common';
import { OrderSynchronizerWatcher } from './order-synchronizer-watcher.abstract';
import { xprisma } from '@opentrader/db';

export class OrderSynchronizerWsWatcher extends OrderSynchronizerWatcher {
  protected readonly logger = new Logger(OrderSynchronizerWsWatcher.name);

  async disable() {
    await super.disable();
    await this.exchangeService.ccxt.close();
  }

  protected async watchOrders() {
    while (this.enabled) {
      try {
        const exchangeOrders = await this.exchangeService.watchOrders();

        for (const exchangeOrder of exchangeOrders) {
          this.logger.debug(
            `Websocket: OrderID ${exchangeOrder.exchangeOrderId}: Price: ${exchangeOrder.price}: Status: ${exchangeOrder.status}`,
          );

          const order = await xprisma.order.findByExchangeOrderId(
            exchangeOrder.exchangeOrderId,
          );

          if (!order) {
            this.logger.debug('Order is not linked to any SmartTrade');
            continue;
          }

          const { smartTrade } = order;

          this.logger.debug(
            `Order #${order.id} is linked to SmartTrade with ID: ${smartTrade.id}`,
          );

          if (exchangeOrder.status === 'filled') {
            const statusChanged = order.status !== 'Filled';

            if (statusChanged) {
              this.emit('onFilled', [exchangeOrder, order]);
            }
          } else if (exchangeOrder.status === 'canceled') {
            const statusChanged = order.status !== 'Canceled';

            if (statusChanged) {
              this.emit('onCanceled', [exchangeOrder, order]);
            }
          }
        }
      } catch (err) {
        console.log(err);
        await this.disable();
        break;
      }
    }
  }
}
