import { z } from "zod";

export const ZGetSmartTradesSchema = z.object({
  botId: z.number().optional(),
});

export type TGetSmartTradesSchema = z.infer<typeof ZGetSmartTradesSchema>;
