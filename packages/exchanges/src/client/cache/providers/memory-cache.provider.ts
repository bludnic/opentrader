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
import type { Dictionary, Exchange, Market } from "ccxt";
import type { ExchangeCode } from "@opentrader/types";
import type { ICacheProvider } from "../../../types/cache/cache-provider.interface.js";

export class MemoryCacheProvider implements ICacheProvider {
  /**
   * Share `markets` across all Exchange instances.
   */
  private store: Partial<Record<ExchangeCode, Dictionary<Market>>> = {};

  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    const startTime = Date.now();
    const cachedMarkets = this.store[exchangeCode];

    if (cachedMarkets) {
      // console.info(
      //   `MemoryCacheProvider: Fetched ${Object.keys(cachedMarkets).length} markets on ${exchangeCode} from cache`,
      // );

      return cachedMarkets;
    }

    const markets = await ccxtExchange.loadMarkets();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // console.info(
    //   `MemoryCacheProvider: Fetched ${Object.keys(markets).length} markets on ${exchangeCode} exchange in ${duration}s`,
    // );

    return this.cacheMarkets(markets, exchangeCode);
  }

  private async cacheMarkets(markets: Dictionary<Market>, exchangeCode: ExchangeCode) {
    this.store[exchangeCode] = markets;
    return markets;
  }
}
