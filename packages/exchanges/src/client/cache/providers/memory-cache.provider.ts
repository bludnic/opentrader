import { Dictionary, Exchange, Market } from "ccxt";
import { ExchangeCode } from "@opentrader/types";
import { ICacheProvider } from "src/types/cache/cache-provider.interface";

export class MemoryCacheProvider implements ICacheProvider {
  /**
   * Share `markets` across all Exchange instances.
   */
  private store: Partial<Record<ExchangeCode, Dictionary<Market>>> = {};

  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    const cachedMarkets = this.store[exchangeCode];

    if (cachedMarkets) {
      console.log(`MemoryCache(${exchangeCode}): from cache`);
      return cachedMarkets;
    }

    console.log(`MemoryCache(${exchangeCode}): from Exchange`);

    const markets = await ccxtExchange.loadMarkets();
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
