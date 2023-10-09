import { zt } from "@opentrader/db";
import { z } from "zod";

export const ZCreateExchangeAccountInputSchema = zt.ExchangeAccountSchema.pick({
  exchangeCode: true,
  name: true,
  apiKey: true,
  secretKey: true,
  password: true,
  isDemoAccount: true,
});

export type TCreateExchangeAccountInputSchema = z.infer<
  typeof ZCreateExchangeAccountInputSchema
>;
