import { z } from 'zod';

export const ZGetSmartTradeInputSchema = z.number();

export type TGetSmartTradeInputSchema = z.infer<
  typeof ZGetSmartTradeInputSchema
>;
