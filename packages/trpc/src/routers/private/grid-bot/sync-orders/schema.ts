import { z } from "zod";

export const ZSyncGridBotOrdersInputSchema = z.object({
  botId: z.number(),
});

export type TSyncGridBotOrdersInputSchema = z.infer<
  typeof ZSyncGridBotOrdersInputSchema
>;
