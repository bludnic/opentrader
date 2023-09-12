import { Module } from '@nestjs/common';
import { BullMQModule } from 'src/core/bullmq/bullmq.module';
import { DatabaseModule } from 'src/core/db/db.module';
import { SmartTradeModule } from 'src/core/smart-trade/smart-trade.module';
import { TwitterApiModule } from 'src/core/twitter-api/twitter-api.module';

@Module({
  imports: [DatabaseModule, TwitterApiModule, BullMQModule, SmartTradeModule],
  exports: [DatabaseModule, TwitterApiModule, BullMQModule, SmartTradeModule],
  providers: [],
})
export class CoreModule {}
