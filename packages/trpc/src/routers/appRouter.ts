import { trpc } from "../trpc.js";
import {
  botRouter,
  cronRouter,
  exchangeAccountsRouter,
  dcaBotRouter,
  gridBotRouter,
  smartTradeRouter,
  symbolsRouter,
} from "./private/router.js";
import { publicRouter } from "./public/router.js";

export const appRouter = trpc.router({
  exchangeAccount: exchangeAccountsRouter,
  symbol: symbolsRouter,
  bot: botRouter,
  dcaBot: dcaBotRouter,
  gridBot: gridBotRouter,
  smartTrade: smartTradeRouter,
  cron: cronRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
