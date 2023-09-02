import { xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';
import { TGetExchangeAccountInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TGetExchangeAccountInputSchema;
};

export async function getExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.findUnique({
    where: {
      id: input,
      ownerId: ctx.user.id,
    },
  });

  return {
    exchangeAccount,
  };
}
