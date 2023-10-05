import { z } from "zod";

export const ZGetExchangeAccountInputSchema = z.number();

export type TGetExchangeAccountInputSchema = z.infer<
  typeof ZGetExchangeAccountInputSchema
>;
