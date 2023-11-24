import { ExchangeCode } from "@opentrader/types";
import { z } from "zod";

export const ZGetSymbolsInputSchema = z.nativeEnum(ExchangeCode);

export type TGetSymbolsInputSchema = z.infer<typeof ZGetSymbolsInputSchema>;
