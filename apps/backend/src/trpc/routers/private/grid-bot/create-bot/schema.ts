import { ZGridBot } from 'src/trpc/prisma/types/grid-bot/grid-bot.schema';
import { z } from 'zod';

export const ZCreateGridBotInputSchema = z.object({
  exchangeAccountId: z.number(),
  data: ZGridBot.pick({
    name: true,
    baseCurrency: true,
    quoteCurrency: true,
    settings: true,
  }),
});

export type TCreateGridBotInputSchema = z.infer<
  typeof ZCreateGridBotInputSchema
>;
