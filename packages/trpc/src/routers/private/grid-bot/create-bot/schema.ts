import { ZGridBot } from "@opentrader/db";
import { z } from "zod";

export const ZCreateGridBotInputSchema = z.object({
  exchangeAccountId: z.number(),
  data: ZGridBot.pick({
    name: true,
    symbol: true,
    settings: true,
  }),
});

export type TCreateGridBotInputSchema = z.infer<typeof ZCreateGridBotInputSchema>;
