import { AuthenticationError, InvalidNonce } from "ccxt";
import { exchangeProvider } from "@opentrader/exchanges";
import { ExchangeAccountWithCredentials } from "@opentrader/db";
import { xprisma } from "@opentrader/db";

/**
 * Check if the exchange account credentials are valid.
 */
export async function checkExchangeCredentials(
  exchangeAccount: ExchangeAccountWithCredentials,
) {
  const exchange = exchangeProvider.fromAccount(exchangeAccount);

  try {
    // to check account credentials validity
    // any private endpoint is fine
    await exchange.accountAssets();

    return {
      valid: true,
      message: undefined,
    };
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
}
