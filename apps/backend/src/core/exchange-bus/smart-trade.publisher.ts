import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { SmartTradeService } from './smart-trade.service';
import { xprisma } from 'src/trpc/prisma';
import { SMART_TRADE_PUBLISHER_JOB } from './constants';

@Injectable()
export class SmartTradePublisher {
  private readonly logger = new Logger(SmartTradePublisher.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron(CronExpression.EVERY_SECOND, {
    name: SMART_TRADE_PUBLISHER_JOB,
  })
  async run() {
    const job = this.schedulerRegistry.getCronJob(SMART_TRADE_PUBLISHER_JOB);
    job.stop(); // pausing the cron job

    // @todo uncomment
    // const startSyncTime = new Date().toISOString();
    // this.logger.debug(`Start syncing process: ${startSyncTime}`);

    const smartTrades = await xprisma.smartTrade.findMany({
      where: {
        type: 'Trade',
        orders: {
          some: {
            status: 'Idle',
          },
        },
      },
      include: {
        exchangeAccount: true,
        orders: true,
      },
    });

    if (smartTrades.length === 0) {
      this.logger.debug(
        `No SmartTrades to be placed. Skip sync process. Timeout 10s`,
      );
      setTimeout(() => {
        job.start();
      }, 10000);
      return;
    }

    // @todo uncomment
    // this.logger.debug(`Smart Trades amount: ${smartTrades.length}`);

    for (const smartTrade of smartTrades) {
      const { exchangeAccount } = smartTrade;

      // @todo uncomment
      // const startSyncBotTime = new Date().toISOString();
      // this.logger.debug(
      //   `Start syncing ${exchangeAccount.exchangeCode} accountId: ${exchangeAccount.id} at time: ${startSyncBotTime}`,
      // );

      const smartTradeService = new SmartTradeService(
        smartTrade,
        exchangeAccount,
      );
      await smartTradeService.placeOrders();

      // @todo uncomment
      // const endSyncBotTime = new Date().toISOString();
      // this.logger.debug(
      //   `${exchangeAccount.exchangeCode} Exchange account ID: ${exchangeAccount.id} synced successfully at ${endSyncBotTime}`,
      // );
    }

    // @todo uncomment
    // const endSyncTime = new Date().toISOString();
    // this.logger.debug(`End syncing process: ${endSyncTime}`);

    job.start();
  }
}
