import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from 'src/trpc/utils/context';

import { appRouter } from './routers/appRouter';

@Injectable()
export class TrpcMiddleware {
  applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
      }),
    );
  }
}
