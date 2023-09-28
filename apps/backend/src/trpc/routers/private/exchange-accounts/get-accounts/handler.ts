import { xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';

type GetExchangeAccountsOptions = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
};

export async function getExchangeAccounts({ ctx }: GetExchangeAccountsOptions) {
  const exchangeAccounts = await xprisma.exchangeAccount.findMany({
    where: {
      ownerId: ctx.user.id,
    },
  });

  return exchangeAccounts;
}
