import { Dictionary, Exchange, Market } from "ccxt";
import { ExchangeCode } from "@opentrader/types";
import { ICacheProvider } from "#exchanges/types/cache/cache-provider.interface";

export class MemoryCacheProvider implements ICacheProvider {
  /**
   * Share `markets` across all Exchange instances.
   */
  private store: Partial<Record<ExchangeCode, Dictionary<Market>>> = {};

  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    console.log("🏛️ @opentrader/exchanges");
    console.log(`    getMarkets() from ${exchangeCode} exchange using MemoryCacheProvider`)

    const startTime = Date.now();
    const cachedMarkets = this.store[exchangeCode];

    if (cachedMarkets) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log(`    Returned from cache in ${duration}s`);
      return cachedMarkets;
    }

    const markets = await ccxtExchange.loadMarkets();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(
      `    Fetched from Exchange in ${duration}s`,
    );

    return this.cacheMarkets(markets, exchangeCode);
  }

  private async cacheMarkets(
    markets: Dictionary<Market>,
    exchangeCode: ExchangeCode,
  ) {
    this.store[exchangeCode] = markets;
    return markets;
  }
}
