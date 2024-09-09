import { ZBot } from "@opentrader/db";
import { z } from "zod";

export const ZUpdateBotInputSchema = z.object({
  botId: z.number(),
  data: ZBot.pick({
    name: true,
    symbol: true,
    settings: true,
    template: true,
    timeframe: true,
    exchangeAccountId: true,
    logging: true,
  }),
});

export type TUpdateBotInputSchema = z.infer<typeof ZUpdateBotInputSchema>;
