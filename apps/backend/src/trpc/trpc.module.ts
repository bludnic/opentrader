import { Module } from '@nestjs/common';
import { SymbolsProcedures } from './symbols/symbols.procedures';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TrpcRouter, TrpcService, SymbolsProcedures],
  exports: [],
})
export class TrpcModule {}
