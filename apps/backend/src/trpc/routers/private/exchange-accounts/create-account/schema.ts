import { zt } from '@bifrost/prisma';
import { z } from 'zod';

export const ZCreateExchangeAccountInputSchema = zt.ExchangeAccountSchema.pick({
  exchangeCode: true,
  name: true,
  apiKey: true,
  secretKey: true,
  passphrase: true,
  isDemoAccount: true,
});

export type TCreateExchangeAccountInputSchema = z.infer<
  typeof ZCreateExchangeAccountInputSchema
>;
