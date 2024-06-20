import { router } from "../../../trpc.js";
import { authorizedProcedure } from "../../../procedures.js";
import { getGridBots } from "./get-bots/handler.js";
import { getGridBot } from "./get-bot/handler.js";
import { ZGetGridBotInputSchema } from "./get-bot/schema.js";
import { createGridBot } from "./create-bot/handler.js";
import { ZCreateGridBotInputSchema } from "./create-bot/schema.js";
import { updateGridBot } from "./update-bot/handler.js";
import { ZUpdateGridBotInputSchema } from "./update-bot/schema.js";
import { getFormOptions } from "./get-form-options/handler.js";
import { ZGetGridBotFormOptionsInputSchema } from "./get-form-options/schema.js";

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
