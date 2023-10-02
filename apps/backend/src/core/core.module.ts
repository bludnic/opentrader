import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/db/db.module';
import { ExchangeBusModule } from 'src/core/exchange-bus/exchange-bus.module';
import { TwitterApiModule } from 'src/core/twitter-api/twitter-api.module';

@Module({
  imports: [DatabaseModule, TwitterApiModule, ExchangeBusModule],
  exports: [DatabaseModule, TwitterApiModule, ExchangeBusModule],
  providers: [],
})
export class CoreModule {}
