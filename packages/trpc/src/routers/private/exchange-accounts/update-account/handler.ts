import { xprisma } from "@opentrader/db";
import type { Context } from "#trpc/utils/context";
import type { TUpdateExchangeAccountInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
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
