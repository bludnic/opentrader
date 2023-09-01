import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from 'src/trpc/utils/context';
import { SymbolsProcedures } from './symbols/symbols.procedures';
import { ExchangeAccountProcedures } from './exchange-accounts/exchange-account.procedures';

import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly symbols: SymbolsProcedures,
    private readonly exchangeAccounts: ExchangeAccountProcedures,
  ) {}

  appRouter = this.trpc.router({
    symbol: this.symbols.getRouter(),
    exchangeAccount: this.exchangeAccounts.getRouter(),
  });

  applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
