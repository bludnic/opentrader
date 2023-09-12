import { ZGridBot } from 'src/trpc/prisma/types/grid-bot/grid-bot.schema';
import { z } from 'zod';

export const ZCreateGridBotInputSchema = z.object({
  exchangeAccountId: z.number(),
  data: ZGridBot.omit({
    id: true,
    ownerId: true,
    exchangeAccountId: true,
  }),
});

export type TCreateGridBotInputSchema = z.infer<
  typeof ZCreateGridBotInputSchema
>;
