import { authorizedProcedure } from "../../../procedures.js";
import { router } from "../../../trpc.js";
import { getExchangeAccounts } from "./get-accounts/handler.js";
import { getExchangeAccount } from "./get-account/handler.js";
import { ZGetExchangeAccountInputSchema } from "./get-account/schema.js";
import { createExchangeAccount } from "./create-account/handler.js";
import { ZCreateExchangeAccountInputSchema } from "./create-account/schema.js";
import { updateExchangeAccount } from "./update-account/handler.js";
import { ZUpdateExchangeAccountInputSchema } from "./update-account/schema.js";
import { deleteExchangeAccount } from "./delete-account/handler.js";
import { ZDeleteExchangeAccountInputSchema } from "./delete-account/schema.js";

export const exchangeAccountsRouter = router({
  list: authorizedProcedure.query(getExchangeAccounts),

  getOne: authorizedProcedure
    .input(ZGetExchangeAccountInputSchema)
    .query(getExchangeAccount),

  create: authorizedProcedure
    .input(ZCreateExchangeAccountInputSchema)
    .mutation(createExchangeAccount),

  update: authorizedProcedure
    .input(ZUpdateExchangeAccountInputSchema)
    .mutation(updateExchangeAccount),

  delete: authorizedProcedure
    .input(ZDeleteExchangeAccountInputSchema)
    .mutation(deleteExchangeAccount),
});
