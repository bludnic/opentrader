import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import {
  GridBotServiceFactory,
  GridBotServiceFactorySymbol,
} from 'src/grid-bot/grid-bot-service.factory';

@Injectable()
export class GridBotSyncService {
  constructor(
    @Inject(GridBotServiceFactorySymbol)
    private gridBotServiceFactory: GridBotServiceFactory,
    private firestore: FirestoreService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleSync() {
    const startSyncTime = new Date().toISOString();

    this.logger.debug(`Start syncing process: ${startSyncTime}`);

    const bots = await this.firestore.gridBot.findAllEnabled();

    if (bots.length === 0) {
      this.logger.debug(`No enabled bots. Skip sync process.`);
    }

    this.logger.debug(`Enabled bots: ${bots.length}`);

    for (const bot of bots) {
      const startSyncBotTime = new Date().toISOString();
      this.logger.debug(
        `Start syncing botId: ${bot.id} with pair: ${bot.baseCurrency}/${bot.quoteCurrency} at time: ${startSyncBotTime}`,
      );

      const gridBotService = await this.gridBotServiceFactory.fromBotId(bot.id);
      const syncResponse = await gridBotService.syncMarketOrders(bot.id);
      this.logger.debug('Sync response', {
        syncResponse,
      });

      const endSyncBotTime = new Date().toISOString();
      this.logger.debug(
        `Bot ${bot.id} synced successfully at ${endSyncBotTime}`,
      );
    }

    const endSyncTime = new Date().toISOString();
    this.logger.debug(`End syncing process: ${endSyncTime}`);
  }
}
