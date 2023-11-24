import { z } from "zod";

export const ZManualProcessGridBotInputSchema = z.object({
  botId: z.number(),
});

export type TManualProcessGridBotInputSchema = z.infer<
  typeof ZManualProcessGridBotInputSchema
>;
