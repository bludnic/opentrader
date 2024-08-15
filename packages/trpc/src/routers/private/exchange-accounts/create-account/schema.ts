import { zt } from "@opentrader/prisma";
import type { z } from "zod";

export const ZCreateExchangeAccountInputSchema = zt.ExchangeAccountSchema.pick({
  exchangeCode: true,
  name: true,
  label: true,
  apiKey: true,
  secretKey: true,
  password: true,
  isDemoAccount: true,
  isPaperAccount: true,
});

export type TCreateExchangeAccountInputSchema = z.infer<typeof ZCreateExchangeAccountInputSchema>;
