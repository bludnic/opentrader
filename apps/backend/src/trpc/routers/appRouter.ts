import { trpc } from 'src/trpc/trpc';
import {
  exchangeAccountsRouter,
  gridBotRouter,
  symbolsRouter,
} from './private';

export const appRouter = trpc.router({
  exchangeAccount: exchangeAccountsRouter,
  symbol: symbolsRouter,
  gridBot: gridBotRouter,
});

export type AppRouter = typeof appRouter;
