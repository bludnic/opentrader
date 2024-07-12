import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TDeleteExchangeAccountInputSchema } from "./schema.js";
import { eventBus } from "../../../../event-bus.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TDeleteExchangeAccountInputSchema;
};

export async function deleteExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.delete({
    where: {
      id: input.id,
    },
  });
  eventBus.exchangeAccountDeleted(exchangeAccount);

  return exchangeAccount;
}
