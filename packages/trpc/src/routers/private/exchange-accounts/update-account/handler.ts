import { xprisma } from "@opentrader/db";
import { checkExchangeCredentials } from "../../../../utils/exchange-account.js";
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
  let exchangeAccount = await xprisma.exchangeAccount.update({
    where: {
      id: input.id,
      ownerId: ctx.user.id,
    },
    data: input.body,
  });

  // It's important to trigger the event before checking the credentials
  // to invalidate the cache of ExchangeProvider.
  eventBus.exchangeAccountUpdated(exchangeAccount);

  const { valid } = await checkExchangeCredentials(exchangeAccount);
  exchangeAccount = await xprisma.exchangeAccount.update({
    where: {
      id: exchangeAccount.id,
    },
    data: {
      expired: !valid,
    },
  });

  return exchangeAccount;
}
