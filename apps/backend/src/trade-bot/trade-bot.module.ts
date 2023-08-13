import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { tradeBotOrdersServiceFactory } from './trade-bot-orders-service.factory';
import { TradeBotOrdersService } from './trade-bot-orders.service';
import { tradeBotServiceFactory } from './trade-bot-service.factory';
import { TradeBotSyncService } from './trade-bot-sync.service';
import { TradeBotController } from './trade-bot.controller';
import { TradeBotService } from './trade-bot.service';

@Module({
  imports: [CoreModule, HttpModule],
  exports: [],
  controllers: [TradeBotController],
  providers: [
    TradeBotService,
    TradeBotOrdersService,
    TradeBotSyncService,
    tradeBotServiceFactory,
    tradeBotOrdersServiceFactory,
    Logger,
  ],
})
export class TradeBotModule {}
