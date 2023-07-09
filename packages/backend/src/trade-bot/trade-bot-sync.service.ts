import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FirestoreService } from "src/core/db/firestore/firestore.service";
import { simpleGrid } from "./bot-templates/simple-grid";
import { TradeBotOrdersServiceFactory, TradeBotOrderServiceFactorySymbol } from "./trade-bot-orders-service.factory";
import { TradeBotServiceFactory, TradeBotServiceFactorySymbol } from "./trade-bot-service.factory";
import { IBotTemplate } from "./types/BotTemplate";

@Injectable()
export class TradeBotSyncService {
    private botTemplate: IBotTemplate;

    constructor(
        @Inject(TradeBotServiceFactorySymbol)
        private tradeBotServiceFactory: TradeBotServiceFactory,
        @Inject(TradeBotOrderServiceFactorySymbol)
        private tradeBotOrdersServiceFactory: TradeBotOrdersServiceFactory,
        private firestore: FirestoreService,
        private readonly logger: Logger,
    ) {
        this.botTemplate = simpleGrid; // @todo hardcoded
    }
    
    @Cron(CronExpression.EVERY_10_SECONDS)
    async sync() {
        const startSyncTime = new Date().toISOString();

        this.logger.debug(`[TradeBotSync] Start syncing process: ${startSyncTime}`);
    
        const bots = await this.firestore.tradeBot.findAllEnabled();
    
        if (bots.length === 0) {
          this.logger.debug(`[TradeBotSync] No enabled bots. Skip sync process.`);
        }
    
        this.logger.debug(`[TradeBotSync] Enabled bots: ${bots.length}`);
    
        for (const bot of bots) {
          const startSyncBotTime = new Date().toISOString();
          this.logger.debug(
            `[TradeBotSync] Start syncing botId: ${bot.id} with pair: ${bot.baseCurrency}/${bot.quoteCurrency} at time: ${startSyncBotTime}`,
          );
    
          const tradeBotService = await this.tradeBotServiceFactory.fromBotId(bot.id);
          const syncedOrdersIds = await tradeBotService.syncOrders(bot);
          this.logger.debug('[TradeBotSync] Sync response', {
            syncedOrdersIds,
          });
    
          const endSyncBotTime = new Date().toISOString();
          this.logger.debug(
            `[TradeBotSync] Bot ${bot.id} synced successfully at ${endSyncBotTime}`,
          );

          // Call the `onChange` HOOK event
          const anyOrderWasSynced = syncedOrdersIds.length > 0;
          
          if (anyOrderWasSynced) {
            const updatedBot = await this.firestore.tradeBot.findOne(bot.id);

            const ordersService = await this.tradeBotOrdersServiceFactory.fromBotId(updatedBot.id);
            const onChangeHook = this.botTemplate.onChange({
              logger: this.logger,
              bot: updatedBot,
              ordersService
            })

            if (onChangeHook instanceof Promise) {
              await onChangeHook;
            }
          }
        }
    
        const endSyncTime = new Date().toISOString();
        this.logger.debug(`[TradeBotSync] End syncing process: ${endSyncTime}`);
    }
}