import { ZBot } from "@opentrader/db";
import { z } from "zod";

export const ZUpdateBotInputSchema = z.object({
  botId: z.number(),
  data: ZBot.omit({
    id: true,
    ownerId: true,
    exchangeAccountId: true,
    type: true,
    enabled: true,
  }).partial(),
});

export type TUpdateBotInputSchema = z.infer<typeof ZUpdateBotInputSchema>;
