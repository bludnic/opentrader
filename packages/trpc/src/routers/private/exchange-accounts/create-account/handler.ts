import { xprisma } from "@opentrader/db";
import type { Context } from "#trpc/utils/context";
import type { TCreateExchangeAccountInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCreateExchangeAccountInputSchema;
};

export async function createExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.create({
    data: {
      ...input,
      owner: {
        connect: {
          id: ctx.user.id,
        },
      },
    },
  });

  return exchangeAccount;
}
