import { z } from "zod";

import { ZDcaBot } from "@opentrader/db";

export const ZUpdateDcaBotInputSchema = z.object({
  botId: z.number(),
  data: ZDcaBot.pick({
    name: true,
    symbol: true,
    settings: true,
    exchangeAccountId: true,
  }),
});

export type TUpdateDcaBotInputSchema = z.infer<typeof ZUpdateDcaBotInputSchema>;
