import { router } from "#trpc/trpc";
import { authorizedProcedure } from "#trpc/procedures";
import { getSymbols } from "./get-symbols/handler";
import { ZGetSymbolsInputSchema } from "./get-symbols/schema";
import { getSymbol } from "./get-symbol/handler";
import { ZGetSymbolInputSchema } from "./get-symbol/schema";
import { getSymbolPrice } from "./get-symbol-price/handler";
import { ZGetSymbolPriceInputSchema } from "./get-symbol-price/schema";

export const symbolsRouter = router({
  list: authorizedProcedure.input(ZGetSymbolsInputSchema).query(getSymbols),
  getOne: authorizedProcedure.input(ZGetSymbolInputSchema).query(getSymbol),
  price: authorizedProcedure
    .input(ZGetSymbolPriceInputSchema)
    .query(getSymbolPrice),
});
