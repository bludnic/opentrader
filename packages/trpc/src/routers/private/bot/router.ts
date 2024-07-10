import { router } from "../../../trpc.js";
import { authorizedProcedure } from "../../../procedures.js";
import { getBots } from "./get-bots/handler.js";
import { getBot } from "./get-bot/handler.js";
import { ZGetBotInputSchema } from "./get-bot/schema.js";
import { createBot } from "./create-bot/handler.js";
import { ZCreateBotInputSchema } from "./create-bot/schema.js";
import { deleteBot } from "./delete-bot/handler.js";
import { ZDeleteBotInputSchema } from "./delete-bot/schema.js";
import { updateBot } from "./update-bot/handler.js";
import { ZUpdateBotInputSchema } from "./update-bot/schema.js";
import { startGridBot } from "./start-bot/handler.js";
import { ZStartGridBotInputSchema } from "./start-bot/schema.js";
import { stopGridBot } from "./stop-bot/handler.js";
import { ZStopGridBotInputSchema } from "./stop-bot/schema.js";
import { manualProcessGridBot } from "./manual-process/handler.js";
import { ZManualProcessGridBotInputSchema } from "./manual-process/schema.js";
import { getActiveSmartTrades } from "./get-active-smart-trades/handler.js";
import { ZGetActiveSmartTradesInputSchema } from "./get-active-smart-trades/schema.js";
import { getOpenSmartTrades } from "./get-open-smart-trades/handler.js";
import { ZGetOpenSmartTradesInputSchema } from "./get-open-smart-trades/schema.js";
import { getPendingSmartTrades } from "./get-pending-smart-trades/handler.js";
import { ZGetPendingSmartTradesInputSchema } from "./get-pending-smart-trades/schema.js";
import { getCompletedSmartTrades } from "./get-completed-smart-trades/handler.js";
import { ZGetCompletedSmartTradesInputSchema } from "./get-completed-smart-trades/schema.js";
import { getGridBotOrders } from "./get-orders/handler.js";
import { ZGetGridBotOrdersInputSchema } from "./get-orders/schema.js";
import { cronPlacePendingOrders } from "./cron-place-pending-orders/handler.js";
import { ZCronPlacePendingOrdersInputSchema } from "./cron-place-pending-orders/schema.js";
import { syncOrders } from "./sync-orders/handler.js";
import { ZSyncGridBotOrdersInputSchema } from "./sync-orders/schema.js";

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
  openSmartTrades: authorizedProcedure
    .input(ZGetOpenSmartTradesInputSchema)
    .query(getOpenSmartTrades),
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
