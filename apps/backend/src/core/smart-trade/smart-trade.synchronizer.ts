import { exchanges } from '@bifrost/exchanges';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OrderNotFound } from 'ccxt';
import { job } from 'cron';
import { xprisma } from 'src/trpc/prisma';

import { SMART_TRADE_SYNCHRONIZER_JOB } from './constants';

@Injectable()
export class SmartTradeSynchronizer {
  private readonly logger = new Logger(SmartTradeSynchronizer.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron(CronExpression.EVERY_SECOND, {
    name: SMART_TRADE_SYNCHRONIZER_JOB,
  })
  async fetchOrder() {
    const job = this.schedulerRegistry.getCronJob(SMART_TRADE_SYNCHRONIZER_JOB);
    job.stop(); // pausing the cron job

    const order = await xprisma.order.findFirst({
      where: {
        status: 'Placed',
      },
      orderBy: {
        updatedAt: 'asc',
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

      await xprisma.order.update({
        // @todo add syncedAt
        where: {
          id: order.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      if (exchangeOrder.status === 'filled') {
        await xprisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: 'Filled',
            filledPrice: exchangeOrder.filledPrice,
          },
        });
        this.logger.debug(
          `Order was filled with price ${exchangeOrder.filledPrice}`,
        );
      } else if (exchangeOrder.status === 'canceled') {
        await xprisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: 'Canceled',
            smartTrade: {
              update: {
                ref: null,
              },
            },
          },
        });

        this.logger.debug(
          `Order was cancelled by the user on the exchange. Change status to "Canceled"`,
          exchangeOrder,
        );
      }
    } catch (err) {
      if (err instanceof OrderNotFound) {
        await xprisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: 'Deleted',
            smartTrade: {
              update: {
                ref: null,
              },
            },
          },
        });

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
