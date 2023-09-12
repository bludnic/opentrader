import { z } from 'zod';

export const ZGetActiveSmartTradesInputSchema = z.object({
  botId: z.number(),
});

export type TGetActiveSmartTradesInputSchema = z.infer<
  typeof ZGetActiveSmartTradesInputSchema
>;
