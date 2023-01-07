import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/db/db.module';
import { ExchangesModule } from 'src/core/exchanges/exchanges.module';
import { TwitterApiModule } from 'src/core/twitter-api/twitter-api.module';

@Module({
  imports: [DatabaseModule, ExchangesModule, TwitterApiModule],
  exports: [DatabaseModule, ExchangesModule, TwitterApiModule],
  providers: [],
})
export class CoreModule {}
