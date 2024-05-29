import { z } from "zod";

export const ZGetOpenSmartTradesInputSchema = z.object({
  botId: z.number(),
});

export type TGetOpenSmartTradesInputSchema = z.infer<
  typeof ZGetOpenSmartTradesInputSchema
>;
