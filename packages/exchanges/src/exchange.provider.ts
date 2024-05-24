/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
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
    const newExchange = exchanges[exchangeCode]({
      ...credentials,
      code: credentials.code,
      password: credentials.password ?? "",
    });

    this.privateExchanges[id] = newExchange; // cache it

    console.debug(
      `ExchangeProvider: Created a new private instance of ${exchangeAccount.exchangeCode}: ${exchangeAccount.name} (ID: ${exchangeAccount.id})`,
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

    console.debug(
      `ExchangeProvider: Created a new public instance of ${exchangeCode}`,
    );

    return newExchange;
  }
}

export const exchangeProvider = new ExchangeProvider();
