import { xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';
import { TGetActiveSmartTradesInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TGetActiveSmartTradesInputSchema;
};

export async function getActiveSmartTrades({ ctx, input }: Options) {
  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      type: 'Trade',
      owner: {
        id: ctx.user.id,
      },
      bot: {
        id: input.botId,
      },
      orders: {
        some: {
          status: {
            in: ['Idle', 'Placed'],
          },
        },
      },
    },
    include: {
      orders: true,
    },
  });

  return smartTrades;
}
