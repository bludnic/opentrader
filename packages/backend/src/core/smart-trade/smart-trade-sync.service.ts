import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FirestoreService } from "src/core/db/firestore/firestore.service";
import { SmartTradePrivateServiceFactory, SmartTradePrivateServiceFactorySymbol } from "./smart-trade-private-service.factory";

@Injectable()
export class SmartTradeSyncService {
    constructor (
        @Inject(SmartTradePrivateServiceFactorySymbol)
        private smartTradePrivateServiceFactory: SmartTradePrivateServiceFactory,
        private firestore: FirestoreService,
        private readonly logger: Logger,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async sync() {
        const startSyncTime = new Date().toISOString();

        this.logger.debug(`[SmartTradeSyncService] Start syncing process: ${startSyncTime}`);
    
        const exchangeAccounts = await this.firestore.exchangeAccount.findAll();
    
        if (exchangeAccounts.length === 0) {
          this.logger.debug(`[SmartTradeSyncService] No exchange accounts. Skip sync process.`);
        }
    
        this.logger.debug(`[SmartTradeSyncService] Exchange accounts: ${exchangeAccounts.length}`);
    
        for (const exchangeAccount of exchangeAccounts) {
          const startSyncBotTime = new Date().toISOString();
          this.logger.debug(
            `[SmartTradeSyncService] Start syncing ${exchangeAccount.exchangeCode} accountId: ${exchangeAccount.id} at time: ${startSyncBotTime}`,
          );
    
          const smartTradeService = this.smartTradePrivateServiceFactory.fromExchangeAccount(exchangeAccount);
          const syncResponse = await smartTradeService.syncSmartTrades(exchangeAccount.id);
          this.logger.debug('[SmartTradeSyncService] Sync response', {
            syncResponse,
          });
    
          const endSyncBotTime = new Date().toISOString();
          this.logger.debug(
            `[SmartTradeSyncService] ${exchangeAccount.exchangeCode} Exchange account ID: ${exchangeAccount.id} synced successfully at ${endSyncBotTime}`,
          );
        }

        const endSyncTime = new Date().toISOString();
        this.logger.debug(`[SmartTradeSyncService] End syncing process: ${endSyncTime}`);
    }
}