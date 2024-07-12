import { z } from "zod";

export const ZDeleteExchangeAccountInputSchema = z.object({
  id: z.number(),
});

export type TDeleteExchangeAccountInputSchema = z.infer<
  typeof ZDeleteExchangeAccountInputSchema
>;
