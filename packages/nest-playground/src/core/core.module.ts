import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/db/db.module';
import { ExchangesModule } from 'src/core/exchanges/exchanges.module';

@Module({
  imports: [DatabaseModule, ExchangesModule],
  exports: [DatabaseModule, ExchangesModule],
  providers: [],
})
export class CoreModule {}
