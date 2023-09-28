import { Module } from '@nestjs/common';
import { BullMQModule } from 'src/core/bullmq/bullmq.module';
import { DatabaseModule } from 'src/core/db/db.module';
import { ExchangeBusModule } from 'src/core/exchange-bus/exchange-bus.module';
import { TwitterApiModule } from 'src/core/twitter-api/twitter-api.module';

@Module({
  imports: [DatabaseModule, TwitterApiModule, BullMQModule, ExchangeBusModule],
  exports: [DatabaseModule, TwitterApiModule, BullMQModule, ExchangeBusModule],
  providers: [],
})
export class CoreModule {}
