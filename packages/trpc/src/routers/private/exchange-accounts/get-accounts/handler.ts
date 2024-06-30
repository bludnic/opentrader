import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";

type GetExchangeAccountsOptions = {
  ctx: {
    user: NonNullable<Context["user"]>;
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
