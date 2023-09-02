import { ExchangeCode } from '@bifrost/types';
import { z } from 'zod';

export const ZGetSymbolsInputSchema = z.nativeEnum(ExchangeCode);

export type TGetSymbolsInputSchema = z.infer<typeof ZGetSymbolsInputSchema>;
