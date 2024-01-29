import { router } from "#trpc/trpc";
import { authorizedProcedure } from "#trpc/procedures";
import { getBots } from "./get-bots/handler";
import { getBot } from "./get-bot/handler";
import { ZGetBotInputSchema } from "./get-bot/schema";
import { createBot } from "./create-bot/handler";
import { ZCreateBotInputSchema } from "./create-bot/schema";
import { deleteBot } from "./delete-bot/handler";
import { ZDeleteBotInputSchema } from "./delete-bot/schema";
import { updateBot } from "./update-bot/handler";
import { ZUpdateBotInputSchema } from "./update-bot/schema";
import { startGridBot } from "./start-bot/handler";
import { ZStartGridBotInputSchema } from "./start-bot/schema";
import { stopGridBot } from "./stop-bot/handler";
import { ZStopGridBotInputSchema } from "./stop-bot/schema";
import { manualProcessGridBot } from "./manual-process/handler";
import { ZManualProcessGridBotInputSchema } from "./manual-process/schema";
import { getActiveSmartTrades } from "./get-active-smart-trades/handler";
import { ZGetActiveSmartTradesInputSchema } from "./get-active-smart-trades/schema";
import { getPendingSmartTrades } from "./get-pending-smart-trades/handler";
import { ZGetPendingSmartTradesInputSchema } from "./get-pending-smart-trades/schema";
import { getCompletedSmartTrades } from "./get-completed-smart-trades/handler";
import { ZGetCompletedSmartTradesInputSchema } from "./get-completed-smart-trades/schema";
import { getGridBotOrders } from "./get-orders/handler";
import { ZGetGridBotOrdersInputSchema } from "./get-orders/schema";
import { cronPlacePendingOrders } from "./cron-place-pending-orders/handler";
import { ZCronPlacePendingOrdersInputSchema } from "./cron-place-pending-orders/schema";
import { syncOrders } from "./sync-orders/handler";
import { ZSyncGridBotOrdersInputSchema } from "./sync-orders/schema";

export const botRouter = router({
  list: authorizedProcedure.query(getBots),
  getOne: authorizedProcedure.input(ZGetBotInputSchema).query(getBot),
  create: authorizedProcedure.input(ZCreateBotInputSchema).mutation(createBot),
  delete: authorizedProcedure.input(ZDeleteBotInputSchema).mutation(deleteBot),
  update: authorizedProcedure.input(ZUpdateBotInputSchema).mutation(updateBot),
  start: authorizedProcedure
    .input(ZStartGridBotInputSchema)
    .mutation(startGridBot),
  stop: authorizedProcedure
    .input(ZStopGridBotInputSchema)
    .mutation(stopGridBot),
  manualProcess: authorizedProcedure
    .input(ZManualProcessGridBotInputSchema)
    .mutation(manualProcessGridBot),
  cronPlaceLimitOrders: authorizedProcedure
    .input(ZCronPlacePendingOrdersInputSchema)
    .mutation(cronPlacePendingOrders),
  syncOrders: authorizedProcedure
    .input(ZSyncGridBotOrdersInputSchema)
    .mutation(syncOrders),
  activeSmartTrades: authorizedProcedure
    .input(ZGetActiveSmartTradesInputSchema)
    .query(getActiveSmartTrades),
  pendingSmartTrades: authorizedProcedure
    .input(ZGetPendingSmartTradesInputSchema)
    .query(getPendingSmartTrades),
  completedSmartTrades: authorizedProcedure
    .input(ZGetCompletedSmartTradesInputSchema)
    .query(getCompletedSmartTrades),
  orders: authorizedProcedure
    .input(ZGetGridBotOrdersInputSchema)
    .query(getGridBotOrders),
});
