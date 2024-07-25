import { xprisma } from "@opentrader/db";
import { checkExchangeCredentials } from "../../../../utils/exchange-account.js";
import type { Context } from "../../../../utils/context.js";
import type { TCheckExchangeAccountInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCheckExchangeAccountInputSchema;
};

/**
 * Check the validity of exchange account credentials.
 * Mark as `expired` if credentials are invalid.
 */
export async function checkExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
    where: {
      id: input.id,
    },
  });

  const { valid, message } = await checkExchangeCredentials(exchangeAccount);

  if (valid) {
    await xprisma.exchangeAccount.update({
      where: {
        id: exchangeAccount.id,
      },
      data: {
        expired: false,
      },
    });

    return {
      valid: true,
      message: "Exchange accounts credentials are valid",
    };
  } else {
    await xprisma.exchangeAccount.update({
      where: {
        id: exchangeAccount.id,
      },
      data: {
        expired: true,
      },
    });

    return {
      valid: false,
      error: message,
    };
  }
}
