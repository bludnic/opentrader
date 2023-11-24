import { isValidSymbolId } from "@opentrader/tools";
import { z } from "zod";

export const ZGetSymbolInputSchema = z.object({
  symbolId: z.string().refine((value) => isValidSymbolId(value), {
    message: "Invalid symbolId (e.g. of a valid one OKX:ETH/USDT)",
  }),
});

export type TGetSymbolInputSchema = z.infer<typeof ZGetSymbolInputSchema>;
