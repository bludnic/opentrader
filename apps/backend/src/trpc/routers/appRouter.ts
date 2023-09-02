import { trpc } from 'src/trpc/trpc';
import { exchangeAccountsRouter, symbolsRouter } from './private';

export const appRouter = trpc.router({
  exchangeAccount: exchangeAccountsRouter,
  symbol: symbolsRouter,
});

export type AppRouter = typeof appRouter;
