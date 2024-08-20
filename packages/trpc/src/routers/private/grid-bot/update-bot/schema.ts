import { ZGridBot } from "@opentrader/db";
import { z } from "zod";

export const ZUpdateGridBotInputSchema = z.object({
  botId: z.number(),
  data: ZGridBot.pick({
    name: true,
    symbol: true,
    settings: true,
    exchangeAccountId: true,
  }),
});

export type TUpdateGridBotInputSchema = z.infer<typeof ZUpdateGridBotInputSchema>;
