import { exchanges, IExchange } from '@bifrost/exchanges';
import { Logger } from '@nestjs/common';
import { xprisma } from 'src/trpc/prisma';
import { ExchangeAccountWithCredentials } from 'src/trpc/prisma/types/exchange-account/exchange-account-with-credentials';

export class OrderSynchronizerWsWatcher {
  private readonly logger = new Logger(OrderSynchronizerWsWatcher.name);

  private exchangeService: IExchange;
  private enabled = false;

  constructor(private exchange: ExchangeAccountWithCredentials) {
    this.exchangeService = exchanges[exchange.exchangeCode](
      exchange.credentials,
    );
  }

  enable() {
    this.enabled = true;
    this.watchOrders();

    this.logger.debug(
      `Created watcher for ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );
  }

  async disable() {
    this.enabled = false;

    await this.exchangeService.ccxt.close();

    this.logger.debug(
      `Destroyed watcher of ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );
  }

  private async watchOrders() {
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

          if (order.status === 'Canceled') {
            this.logger.debug(
              `Order ${order.id} is already Canceled. Nothing to do.`,
            );
            continue;
          }

          const { smartTrade } = order;

          this.logger.debug(
            `Order #${order.id} is linked to SmartTrade with ID: ${smartTrade.id}`,
          );

          if (exchangeOrder.status === 'filled') {
            await xprisma.order.updateStatusToFilled({
              orderId: order.id,
              filledPrice: exchangeOrder.filledPrice,
            });
            this.logger.debug(`Updated status -> Filled`);
          } else if (exchangeOrder.status === 'canceled') {
            // Edge case: the user may cancel the order manually on the exchange
            await xprisma.order.updateStatus('Canceled', order.id);
            this.logger.debug(`Updated status -> Canceled`);
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
