import { ZBot } from "@opentrader/db";
import { z } from "zod";

export const ZCreateBotInputSchema = z.object({
  exchangeAccountId: z.number(),
  data: ZBot.pick({
    name: true,
    symbol: true,
    settings: true,
    template: true,
    timeframe: true,
    logging: true,
  }),
});

export type TCreateBotInputSchema = z.infer<typeof ZCreateBotInputSchema>;
