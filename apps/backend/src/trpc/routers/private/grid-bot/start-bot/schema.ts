import { z } from 'zod';

export const ZStartGridBotInputSchema = z.object({
  botId: z.number(),
});

export type TStartGridBotInputSchema = z.infer<typeof ZStartGridBotInputSchema>;
