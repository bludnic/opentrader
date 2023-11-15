import { zt } from "@opentrader/prisma";
import { z } from "zod";

export const ZUpdateExchangeAccountInputSchema = z.object({
  id: z.number(),
  body: zt.ExchangeAccountSchema.pick({
    exchangeCode: true,
    name: true,
    apiKey: true,
    secretKey: true,
    password: true,
    isDemoAccount: true,
  }),
});

export type TUpdateExchangeAccountInputSchema = z.infer<
  typeof ZUpdateExchangeAccountInputSchema
>;
