import { Module } from '@nestjs/common';
import { BullMQModule } from 'src/core/bullmq/bullmq.module';
import { DatabaseModule } from 'src/core/db/db.module';
import { ExchangesModule } from 'src/core/exchanges/exchanges.module';
import { TwitterApiModule } from 'src/core/twitter-api/twitter-api.module';
import { BotManagerModule } from './bot-manager/bot-manager.module';
import { SmartTradeModule } from './smart-trade/smart-trade.module';

@Module({
  imports: [
    DatabaseModule,
    ExchangesModule,
    TwitterApiModule,
    SmartTradeModule,
    BotManagerModule,
    BullMQModule,
  ],
  exports: [
    DatabaseModule,
    ExchangesModule,
    TwitterApiModule,
    SmartTradeModule,
    BotManagerModule,
    BullMQModule,
  ],
  providers: [],
})
export class CoreModule {}
