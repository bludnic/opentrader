import { xprisma } from 'src/trpc/prisma';
import { toSmartTrade } from 'src/trpc/prisma/models/smart-trade-entity';
import { Context } from 'src/trpc/utils/context';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
};

export async function getSmartTrades({ ctx }: Options) {
  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      owner: {
        id: ctx.user.id,
      },
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  return smartTrades.map((smartTrade) => toSmartTrade(smartTrade));
}
