import { AuthenticationError, InvalidNonce } from "ccxt";
import { xprisma } from "@opentrader/db";
import { exchangeProvider } from "@opentrader/exchanges";
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

  const exchange = exchangeProvider.fromAccount(exchangeAccount);

  try {
    // to check account credentials validity
    // any private endpoint is fine
    await exchange.accountAssets();

    await xprisma.exchangeAccount.update({
      where: {
        id: exchangeAccount.id,
      },
      data: {
        expired: false,
      },
    });
  } catch (err) {
    if (err instanceof AuthenticationError || err instanceof InvalidNonce) {
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
        error: err.message,
      };
    }

    throw err;
  }

  return {
    valid: true,
    message: "Exchange accounts credentials are valid",
  };
}
