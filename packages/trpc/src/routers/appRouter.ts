import { trpc } from "#trpc/trpc"; // @todo relative path
import {
  cronRouter,
  exchangeAccountsRouter,
  gridBotRouter,
  smartTradeRouter,
  symbolsRouter,
} from "./private";

export const appRouter = trpc.router({
  exchangeAccount: exchangeAccountsRouter,
  symbol: symbolsRouter,
  gridBot: gridBotRouter,
  smartTrade: smartTradeRouter,
  cron: cronRouter,
});

export type AppRouter = typeof appRouter;
