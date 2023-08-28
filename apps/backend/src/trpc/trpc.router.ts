import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { SymbolsProcedures } from './symbols/symbols.procedures';

import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly symbols: SymbolsProcedures,
  ) {}

  appRouter = this.trpc.mergeRouters(this.symbols.getRouter());

  applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
