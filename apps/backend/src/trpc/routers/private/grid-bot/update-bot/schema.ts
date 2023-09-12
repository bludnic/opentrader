import { ZGridBot } from 'src/trpc/prisma/types/grid-bot/grid-bot.schema';
import { z } from 'zod';

export const ZUpdateGridBotInputSchema = z.object({
  botId: z.number(),
  data: ZGridBot.omit({
    id: true,
    ownerId: true,
    exchangeAccountId: true,
    type: true,
    enabled: true,
  }),
});

export type TUpdateGridBotInputSchema = z.infer<
  typeof ZUpdateGridBotInputSchema
>;
