import { xprisma } from "@opentrader/db";
import { checkExchangeCredentials } from "../../../../utils/exchange-account.js";
import { eventBus } from "@opentrader/event-bus";
import type { Context } from "../../../../utils/context.js";
import type { TCreateExchangeAccountInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCreateExchangeAccountInputSchema;
};

export async function createExchangeAccount({ input, ctx }: Options) {
  let exchangeAccount = await xprisma.exchangeAccount.create({
    data: {
      ...input,
      owner: {
        connect: {
          id: ctx.user.id,
        },
      },
    },
  });

  const { valid } = await checkExchangeCredentials(exchangeAccount);
  exchangeAccount = await xprisma.exchangeAccount.update({
    where: {
      id: exchangeAccount.id,
    },
    data: {
      expired: !valid,
    },
  });

  eventBus.exchangeAccountCreated(exchangeAccount);

  return exchangeAccount;
}
