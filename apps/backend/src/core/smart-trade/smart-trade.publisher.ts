import { exchanges } from '@bifrost/exchanges';
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

    const startSyncTime = new Date().toISOString();

    this.logger.debug(`Start syncing process: ${startSyncTime}`);

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
        `No SmartTrades to be placed. Skip sync process. Timeout 60s`,
      );
      setTimeout(() => {
        job.start();
      }, 60000);
      return;
    }

    this.logger.debug(`Smart Trades amount: ${smartTrades.length}`);

    for (const smartTrade of smartTrades) {
      const { exchangeAccount } = smartTrade;

      const startSyncBotTime = new Date().toISOString();
      this.logger.debug(
        `Start syncing ${exchangeAccount.exchangeCode} accountId: ${exchangeAccount.id} at time: ${startSyncBotTime}`,
      );

      const exchange = exchanges[exchangeAccount.exchangeCode](
        exchangeAccount.credentials,
      );
      const smartTradeService = new SmartTradeService(
        smartTrade,
        exchange,
        this.logger,
      );
      await smartTradeService.placeOrders();

      const endSyncBotTime = new Date().toISOString();
      this.logger.debug(
        `${exchangeAccount.exchangeCode} Exchange account ID: ${exchangeAccount.id} synced successfully at ${endSyncBotTime}`,
      );
    }

    const endSyncTime = new Date().toISOString();
    this.logger.debug(`End syncing process: ${endSyncTime}`);

    job.start();
  }
}
