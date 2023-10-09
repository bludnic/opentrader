import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";
import { TGetExchangeAccountInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetExchangeAccountInputSchema;
};

export async function getExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
    where: {
      id: input,
      ownerId: ctx.user.id,
    },
  });

  return exchangeAccount;
}
