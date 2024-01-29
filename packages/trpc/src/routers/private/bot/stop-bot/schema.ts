import { z } from "zod";

export const ZStopGridBotInputSchema = z.object({
  botId: z.number(),
});

export type TStopGridBotInputSchema = z.infer<typeof ZStopGridBotInputSchema>;
