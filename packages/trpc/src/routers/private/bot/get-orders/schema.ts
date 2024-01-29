import { z } from "zod";

export const ZGetGridBotOrdersInputSchema = z.object({
  botId: z.number(),
});

export type TGetGridBotOrdersInputSchema = z.infer<
  typeof ZGetGridBotOrdersInputSchema
>;
