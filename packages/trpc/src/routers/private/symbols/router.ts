import { router } from "../../../trpc.js";
import { authorizedProcedure } from "../../../procedures.js";
import { getSymbols } from "./get-symbols/handler.js";
import { ZGetSymbolsInputSchema } from "./get-symbols/schema.js";
import { getSymbol } from "./get-symbol/handler.js";
import { ZGetSymbolInputSchema } from "./get-symbol/schema.js";
import { getSymbolPrice } from "./get-symbol-price/handler.js";
import { ZGetSymbolPriceInputSchema } from "./get-symbol-price/schema.js";

export const symbolsRouter = router({
  list: authorizedProcedure.input(ZGetSymbolsInputSchema).query(getSymbols),
  getOne: authorizedProcedure.input(ZGetSymbolInputSchema).query(getSymbol),
  price: authorizedProcedure
    .input(ZGetSymbolPriceInputSchema)
    .query(getSymbolPrice),
});
