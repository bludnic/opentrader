import { z } from "zod";

export const ZGetPendingSmartTradesInputSchema = z.object({
  botId: z.number(),
});

export type TGetPendingSmartTradesInputSchema = z.infer<
  typeof ZGetPendingSmartTradesInputSchema
>;
