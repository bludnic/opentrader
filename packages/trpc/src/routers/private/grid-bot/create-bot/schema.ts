import { z } from "zod";

import { ZGridBot } from "@opentrader/db";

export const ZCreateGridBotInputSchema = z.object({
  exchangeAccountId: z.number(),
  data: ZGridBot.pick({
    name: true,
    symbol: true,
    settings: true,
  }),
});

export type TCreateGridBotInputSchema = z.infer<typeof ZCreateGridBotInputSchema>;
