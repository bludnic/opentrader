import { router } from "#trpc/trpc";
import { authorizedProcedure } from "#trpc/procedures";
import { getGridBots } from "./get-bots/handler";
import { getGridBot } from "./get-bot/handler";
import { ZGetGridBotInputSchema } from "./get-bot/schema";
import { createGridBot } from "./create-bot/handler";
import { ZCreateGridBotInputSchema } from "./create-bot/schema";
import { updateGridBot } from "./update-bot/handler";
import { ZUpdateGridBotInputSchema } from "./update-bot/schema";
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
  formOptions: authorizedProcedure
    .input(ZGetGridBotFormOptionsInputSchema)
    .query(getFormOptions),
});
