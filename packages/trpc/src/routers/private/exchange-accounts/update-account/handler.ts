import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TUpdateExchangeAccountInputSchema } from "./schema.js";
import { eventBus } from "../../../../event-bus.js";

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
  eventBus.exchangeAccountUpdated(exchangeAccount);

  return exchangeAccount;
}
