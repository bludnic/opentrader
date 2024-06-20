import { router } from "../../../trpc.js";
import { authorizedProcedure } from "../../../procedures.js";
import { getSmartTrades } from "./get-smart-trades/handler.js";
import { ZGetSmartTradesSchema } from "./get-smart-trades/schema.js";
import { getSmartTrade } from "./get-smart-trade/handler.js";
import { ZGetSmartTradeInputSchema } from "./get-smart-trade/schema.js";

export const smartTradeRouter = router({
  list: authorizedProcedure.input(ZGetSmartTradesSchema).query(getSmartTrades),
  getOne: authorizedProcedure
    .input(ZGetSmartTradeInputSchema)
    .query(getSmartTrade),
});
