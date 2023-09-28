import { trpc } from "src/lib/trpc/index";
import { createMutation } from "src/utils/react-query/createMutation";
import { createProcedure } from "src/utils/react-query/createProcedure";

export const trpcApi = {
  exchangeAccount: {
    list: createProcedure(
      () => ["exchangeAccount", "list"] as const,
      trpc.exchangeAccount.list.query,
    ),
    one: createProcedure(
      (exchangeId) => ["exchangeAccount", "one", exchangeId] as const,
      trpc.exchangeAccount.getOne.query,
    ),
    update: createMutation(trpc.exchangeAccount.update.mutate),
    create: createMutation(trpc.exchangeAccount.create.mutate),
  },

  symbol: {
    list: createProcedure(
      (exchangeCode) => ["symbols", "list", exchangeCode] as const,
      trpc.symbol.list.query,
    ),
    price: createProcedure(
      (symbolId) => ["symbols", "one", "price", symbolId],
      trpc.symbol.price.query,
    ),
  },

  gridBot: {
    list: createProcedure(
      () => ["gridBot", "list"] as const,
      trpc.gridBot.list.query,
    ),
    getOne: createProcedure(
      (botId) => ["gridBot", "one", botId] as const,
      trpc.gridBot.getOne.query,
    ),
    getActiveSmartTrades: createProcedure(
      (data) => ["gridBot", "one", data.botId, "activeSmartTrades"],
      trpc.gridBot.activeSmartTrades.query,
    ),
    getCompletedSmartTrades: createProcedure(
      (data) => ["gridBot", "one", data.botId, "completedSmartTrades"],
      trpc.gridBot.completedSmartTrades.query,
    ),
    getOrders: createProcedure(
      (data) => ["gridBot", "one", data.botId, "orders"],
      trpc.gridBot.orders.query,
    ),

    create: createMutation(trpc.gridBot.create.mutate),
    update: createMutation(trpc.gridBot.update.mutate),
    manualProcess: createMutation(trpc.gridBot.manualProcess.mutate),
    start: createMutation(trpc.gridBot.start.mutate),
    stop: createMutation(trpc.gridBot.stop.mutate),
  },
};
