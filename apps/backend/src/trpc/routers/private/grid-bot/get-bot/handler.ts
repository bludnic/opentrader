import { prisma, xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';
import { TGetGridBotInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TGetGridBotInputSchema;
};

export async function getGridBot({ ctx, input: id }: Options) {
  const bot = await xprisma.bot.grid.findUniqueOrThrow({
    where: {
      id,
      owner: {
        id: ctx.user.id,
      },
    },
  });

  // @todo remove
  const smartTrade = await prisma.smartTrade.findFirst({
    where: {
      OR: [
        {
          AND: [
            {
              orders: {
                some: {
                  side: 'Buy',
                  status: 'Idle',
                },
              },
            },
            {
              orders: {
                some: {
                  side: 'Sell',
                  status: 'Idle',
                },
              },
            },
          ],
        },
        {
          AND: [
            {
              orders: {
                some: {
                  side: 'Buy',
                  status: 'Placed',
                },
              },
            },
            {
              orders: {
                some: {
                  side: 'Sell',
                  status: 'Idle',
                },
              },
            },
          ],
        },
      ],
    },
    include: {
      orders: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });
  console.log('smartTrade', smartTrade);

  return bot;
}
