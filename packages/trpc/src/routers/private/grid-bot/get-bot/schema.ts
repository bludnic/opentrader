import { z } from 'zod';

export const ZGetGridBotInputSchema = z.number();

export type TGetGridBotInputSchema = z.infer<typeof ZGetGridBotInputSchema>;
