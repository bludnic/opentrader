import { Module } from '@nestjs/common';
import { SymbolsProcedures } from './symbols/symbols.procedures';
import { ExchangeAccountProcedures } from './exchange-accounts/exchange-account.procedures';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    TrpcRouter,
    TrpcService,
    SymbolsProcedures,
    ExchangeAccountProcedures,
  ],
  exports: [],
})
export class TrpcModule {}
