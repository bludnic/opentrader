import { xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';
import { TUpdateExchangeAccountInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TUpdateExchangeAccountInputSchema;
};

export async function updateExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.update({
    where: {
      id: input.id,
      ownerId: ctx.user.id,
    },
    data: input.body,
  });

  return exchangeAccount;
}
