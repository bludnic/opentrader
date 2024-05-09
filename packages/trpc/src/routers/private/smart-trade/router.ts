import { router } from "../../../trpc";
import { authorizedProcedure } from "../../../procedures";
import { getSmartTrades } from "./get-smart-trades/handler";
import { getSmartTrade } from "./get-smart-trade/handler";
import { ZGetSmartTradeInputSchema } from "./get-smart-trade/schema";

export const smartTradeRouter = router({
  list: authorizedProcedure.query(getSmartTrades),
  getOne: authorizedProcedure
    .input(ZGetSmartTradeInputSchema)
    .query(getSmartTrade),
});
