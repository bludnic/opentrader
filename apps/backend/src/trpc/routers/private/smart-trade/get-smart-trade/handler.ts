import { xprisma } from 'src/trpc/prisma';
import { toSmartTrade } from 'src/trpc/prisma/models/smart-trade-entity';
import { Context } from 'src/trpc/utils/context';
import { TGetSmartTradeInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TGetSmartTradeInputSchema;
};

export async function getSmartTrade({ ctx, input: id }: Options) {
  const smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  return toSmartTrade(smartTrade);
}
