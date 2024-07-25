import { ZGridBot } from "@opentrader/db";
import { z } from "zod";

export const ZUpdateGridBotInputSchema = z.object({
  botId: z.number(),
  data: ZGridBot.pick({
    name: true,
    baseCurrency: true,
    quoteCurrency: true,
    settings: true,
    exchangeAccountId: true,
  }),
});

export type TUpdateGridBotInputSchema = z.infer<
  typeof ZUpdateGridBotInputSchema
>;
