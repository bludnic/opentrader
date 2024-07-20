import { z } from "zod";

export const ZCheckExchangeAccountInputSchema = z.object({
  id: z.number(),
});

export type TCheckExchangeAccountInputSchema = z.infer<
  typeof ZCheckExchangeAccountInputSchema
>;
