import { exchanges } from '@bifrost/exchanges';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OrderNotFound } from 'ccxt';
import { xprisma } from 'src/trpc/prisma';

import { SMART_TRADE_SYNCHRONIZER_JOB } from './constants';

@Injectable()
export class OrderSynchronizerPollingWatcher {
  private readonly logger = new Logger(OrderSynchronizerPollingWatcher.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron(CronExpression.EVERY_SECOND, {
    name: SMART_TRADE_SYNCHRONIZER_JOB,
  })
  async fetchOrder() {
    const job = this.schedulerRegistry.getCronJob(SMART_TRADE_SYNCHRONIZER_JOB);
    job.stop(); // pausing the cron job

    // find oldest synced order with status === Placed
    const order = await xprisma.order.findFirst({
      where: {
        status: 'Placed',
      },
      orderBy: {
        syncedAt: 'asc',
      },
      include: {
        smartTrade: {
          include: {
            exchangeAccount: true,
          },
        },
      },
    });

    if (!order) {
      this.logger.debug(`No orders with status Placed. Timeout for 60s`);

      setTimeout(() => {
        job.start();
      }, 60000);

      return;
    }
    if (!order.exchangeOrderId) {
      throw new Error('Order: Missing `exchangeOrderId`');
    }

    const { smartTrade } = order;
    const { exchangeAccount } = smartTrade;
    const exchange = exchanges[exchangeAccount.exchangeCode](
      exchangeAccount.credentials,
    );

    this.logger.debug(
      `Synchronize order #${order.id}: exchangeOrderId "${order.exchangeOrderId}": price: ${order.price}: status: ${order.status}`,
    );
    try {
      const exchangeOrder = await exchange.getLimitOrder({
        orderId: order.exchangeOrderId,
        symbol: smartTrade.exchangeSymbolId,
      });

      await xprisma.order.updateSyncedAt(order.id);

      if (exchangeOrder.status === 'filled') {
        await xprisma.order.updateStatusToFilled({
          orderId: order.id,
          filledPrice: exchangeOrder.filledPrice,
        });
        this.logger.debug(
          `Order #${order.id} was filled with price ${exchangeOrder.filledPrice}`,
        );
      } else if (exchangeOrder.status === 'canceled') {
        // Edge case: the user canceled the order manually on the exchange
        await xprisma.order.updateStatus('Canceled', order.id);

        this.logger.debug(
          `Order #${order.id} was cancelled on the Exchange`,
          exchangeOrder,
        );
      }
    } catch (err) {
      if (err instanceof OrderNotFound) {
        await xprisma.order.updateStatus('Deleted', order.id);

        this.logger.debug(
          `Order not found on the exchange. Change status to "Deleted"`,
        );
      } else {
        throw err;
      }
    }

    job.start(); // restarting the cron job
  }
}
