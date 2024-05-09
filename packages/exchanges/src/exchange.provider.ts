import type { ExchangeAccountWithCredentials } from "@opentrader/db";
import type { ExchangeCode } from "@opentrader/types";
import { exchanges } from "./exchanges";
import type { IExchange } from "./types";

type ExchangeAccountId = number;

/**
 * Class for storing and sharing the same Exchange instance.
 * The main reason of using that provider is to avoid rate limits
 * of the Exchange. This is caused by recreating the same instance of
 * Exchange, ending in additional requests to `fetchMarkets()`.
 */
export class ExchangeProvider {
  /**
   * Private exchanges that requires credentials.
   */
  private privateExchanges: Partial<Record<ExchangeAccountId, IExchange>> = {};
  /**
   * Public exchanges. Allowed to access only public endpoints.
   */
  private publicExchanges: Partial<Record<ExchangeCode, IExchange>> = {};

  fromAccount(exchangeAccount: ExchangeAccountWithCredentials): IExchange {
    const { id, exchangeCode, credentials } = exchangeAccount;

    // Return cached if instance available
    const cachedExchange = this.privateExchanges[id];
    if (cachedExchange) {
      // console.log(
      //   `🔌 ExchangeProvider: Reused cached private instance of ${exchangeAccount.exchangeCode}: ${exchangeAccount.name} (#${exchangeAccount.id})`,
      // );
      return cachedExchange;
    }

    // Create new exchange instance
    const newExchange = exchanges[exchangeCode as ExchangeCode]({
      ...credentials,
      code: credentials.code,
      password: credentials.password ?? "",
    });

    this.privateExchanges[id] = newExchange; // cache it

    console.log(
      `❕ ExchangeProvider: Created a new private instance of ${exchangeAccount.exchangeCode}: ${exchangeAccount.name} (#${exchangeAccount.id})`,
    );

    return newExchange;
  }

  fromCode(exchangeCode: ExchangeCode) {
    // Return cached if instance available
    const cachedExchange = this.publicExchanges[exchangeCode];
    if (cachedExchange) {
      // console.log(
      //   `🔌 ExchangeProvider: Reused cached public instance of ${exchangeCode}`,
      // );
      return cachedExchange;
    }

    // Create new exchange instance
    const newExchange = exchanges[exchangeCode]();

    this.publicExchanges[exchangeCode] = newExchange; // cache it

    console.log(
      `❕ ExchangeProvider: Created a new public instance of ${exchangeCode}`,
    );

    return newExchange;
  }
}

export const exchangeProvider = new ExchangeProvider();
