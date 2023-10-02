import { trpc } from 'src/trpc/trpc';
import {
  exchangeAccountsRouter,
  gridBotRouter,
  smartTradeRouter,
  symbolsRouter,
} from './private';

export const appRouter = trpc.router({
  exchangeAccount: exchangeAccountsRouter,
  symbol: symbolsRouter,
  gridBot: gridBotRouter,
  smartTrade: smartTradeRouter,
});

export type AppRouter = typeof appRouter;
