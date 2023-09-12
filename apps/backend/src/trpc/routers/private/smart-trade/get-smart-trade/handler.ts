import { xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';
import { TGetSmartTradeInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TGetSmartTradeInputSchema;
};

export async function getSmartTrade({ ctx, input: id }: Options) {
  const smartTrade = await xprisma.smartTrade.findUnique({
    where: {
      id,
    },
  });

  return smartTrade;
}
