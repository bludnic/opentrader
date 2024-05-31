import { trpc } from "../trpc"; // @todo relative path
import {
  botRouter,
  cronRouter,
  exchangeAccountsRouter,
  gridBotRouter,
  smartTradeRouter,
  symbolsRouter,
} from "./private";
import { publicRouter } from "./public";

export const appRouter = trpc.router({
  exchangeAccount: exchangeAccountsRouter,
  symbol: symbolsRouter,
  bot: botRouter,
  gridBot: gridBotRouter,
  smartTrade: smartTradeRouter,
  cron: cronRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
