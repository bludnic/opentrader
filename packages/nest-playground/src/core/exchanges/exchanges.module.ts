import { Module } from '@nestjs/common';
import { OkxExchangeModule } from 'src/core/exchanges/okx/okx-exchange.module';

@Module({
  imports: [OkxExchangeModule],
  exports: [OkxExchangeModule],
  providers: [],
})
export class ExchangesModule {}
