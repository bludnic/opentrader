import { z } from "zod";

export const ZDeleteBotInputSchema = z.object({
  botId: z.number(),
});

export type TDeleteBotInputSchema = z.infer<typeof ZDeleteBotInputSchema>;
