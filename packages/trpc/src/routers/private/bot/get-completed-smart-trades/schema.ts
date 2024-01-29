import { z } from "zod";

export const ZGetCompletedSmartTradesInputSchema = z.object({
  botId: z.number(),
});

export type TGetCompletedSmartTradesInputSchema = z.infer<
  typeof ZGetCompletedSmartTradesInputSchema
>;
