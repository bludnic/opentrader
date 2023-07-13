import { Module } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { ExchangeAccountsController } from 'src/exchange-accounts/exchange-accounts.controller';
import { ExchangeAccountsService } from 'src/exchange-accounts/exchange-accounts.service';

@Module({
  imports: [CoreModule],
  exports: [],
  providers: [ExchangeAccountsService],
  controllers: [ExchangeAccountsController],
})
export class ExchangeAccountsModule {}
