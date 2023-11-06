import { router } from "#trpc/trpc";
import { authorizedProcedure } from "#trpc/procedures";

import { getGridBots } from "./get-bots/handler";

import { getGridBot } from "./get-bot/handler";
import { ZGetGridBotInputSchema } from "./get-bot/schema";

import { createGridBot } from "./create-bot/handler";
import { ZCreateGridBotInputSchema } from "./create-bot/schema";

import { updateGridBot } from "./update-bot/handler";
import { ZUpdateGridBotInputSchema } from "./update-bot/schema";

import { startGridBot } from "./start-bot/handler";
import { ZStartGridBotInputSchema } from "./start-bot/schema";

import { stopGridBot } from "./stop-bot/handler";
import { ZStopGridBotInputSchema } from "./stop-bot/schema";

import { manualProcessGridBot } from "./manual-process/handler";
import { ZManualProcessGridBotInputSchema } from "./manual-process/schema";

import { getActiveSmartTrades } from "./get-active-smart-trades/handler";
import { ZGetActiveSmartTradesInputSchema } from "./get-active-smart-trades/schema";

import { getCompletedSmartTrades } from "./get-completed-smart-trades/handler";
import { ZGetCompletedSmartTradesInputSchema } from "./get-completed-smart-trades/schema";

import { getGridBotOrders } from "./get-orders/handler";
import { ZGetGridBotOrdersInputSchema } from "./get-orders/schema";

import { getFormOptions } from "./get-form-options/handler";
import { ZGetGridBotFormOptionsInputSchema } from "./get-form-options/schema";

export const gridBotRouter = router({
  list: authorizedProcedure.query(getGridBots),
  getOne: authorizedProcedure.input(ZGetGridBotInputSchema).query(getGridBot),
  create: authorizedProcedure
    .input(ZCreateGridBotInputSchema)
    .mutation(createGridBot),
  update: authorizedProcedure
    .input(ZUpdateGridBotInputSchema)
    .mutation(updateGridBot),
  start: authorizedProcedure
    .input(ZStartGridBotInputSchema)
    .mutation(startGridBot),
  stop: authorizedProcedure
    .input(ZStopGridBotInputSchema)
    .mutation(stopGridBot),
  manualProcess: authorizedProcedure
    .input(ZManualProcessGridBotInputSchema)
    .mutation(manualProcessGridBot),
  activeSmartTrades: authorizedProcedure
    .input(ZGetActiveSmartTradesInputSchema)
    .query(getActiveSmartTrades),
  completedSmartTrades: authorizedProcedure
    .input(ZGetCompletedSmartTradesInputSchema)
    .query(getCompletedSmartTrades),
  orders: authorizedProcedure
    .input(ZGetGridBotOrdersInputSchema)
    .query(getGridBotOrders),
  formOptions: authorizedProcedure
    .input(ZGetGridBotFormOptionsInputSchema)
    .query(getFormOptions),
});
