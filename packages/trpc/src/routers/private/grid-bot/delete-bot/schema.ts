import { z } from "zod";

export const ZDeleteGridBotInputSchema = z.object({
  botId: z.number(),
});

export type TDeleteGridBotInputSchema = z.infer<
  typeof ZDeleteGridBotInputSchema
>;
