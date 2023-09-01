import { exchanges } from '@bifrost/exchanges';
import { ExchangeCode } from '@bifrost/types';
import { Injectable } from '@nestjs/common';
import { TrpcService } from 'src/trpc/trpc.service';
import z from 'zod';

@Injectable()
export class SymbolsProcedures {
  constructor(private readonly trpc: TrpcService) {}

  getRouter() {
    return this.trpc.router({
      list: this.trpc.procedure
        .use(this.trpc.isLoggedIn)
        .input(z.nativeEnum(ExchangeCode))
        .query(async (opts) => {
          const { input: exchangeCode } = opts;
          const exchangeService = exchanges[exchangeCode]();

          const symbols = await exchangeService.getSymbols();

          return {
            symbols,
          };
        }),
    });
  }
}
