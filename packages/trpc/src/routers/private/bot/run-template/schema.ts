import { z } from "zod";

export const ZRunBotTemplateInputSchema = z.object({
  botId: z.number(),
});

export type TRunBotTemplateInputSchema = z.infer<
  typeof ZRunBotTemplateInputSchema
>;
