import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './utils/context';

@Injectable()
export class TrpcService {
  trpc = initTRPC.context<Context>().create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
  middleware = this.trpc.middleware;
  isLoggedIn = this.middleware(({ next, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    return next({
      ctx: {
        // Infers the `user` as non-nullable
        user: ctx.user,
      },
    });
  });
}
