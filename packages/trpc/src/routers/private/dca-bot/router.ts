import { router } from "../../../trpc.js";
import { authorizedProcedure } from "../../../procedures.js";
import { getDcaBots } from "./get-bots/handler.js";
import { getDcaBot } from "./get-bot/handler.js";
import { ZGetDcaBotInputSchema } from "./get-bot/schema.js";
import { createDcaBot } from "./create-bot/handler.js";
import { ZCreateDcaBotInputSchema } from "./create-bot/schema.js";
import { updateDcaBot } from "./update-bot/handler.js";
import { ZUpdateDcaBotInputSchema } from "./update-bot/schema.js";
import { getFormOptions } from "./get-form-options/handler.js";
import { ZGetDcaBotFormOptionsInputSchema } from "./get-form-options/schema.js";

export const dcaBotRouter = router({
  list: authorizedProcedure.query(getDcaBots),
  getOne: authorizedProcedure.input(ZGetDcaBotInputSchema).query(getDcaBot),
  create: authorizedProcedure.input(ZCreateDcaBotInputSchema).mutation(createDcaBot),
  update: authorizedProcedure.input(ZUpdateDcaBotInputSchema).mutation(updateDcaBot),
  formOptions: authorizedProcedure.input(ZGetDcaBotFormOptionsInputSchema).query(getFormOptions),
});
