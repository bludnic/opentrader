import { logger } from "@opentrader/logger/dist";
import type { Dictionary, Exchange, Market } from "ccxt";
import type { ExchangeCode } from "@opentrader/types";
import type { ICacheProvider } from "../../../types/cache/cache-provider.interface";

export class MemoryCacheProvider implements ICacheProvider {
  /**
   * Share `markets` across all Exchange instances.
   */
  private store: Partial<Record<ExchangeCode, Dictionary<Market>>> = {};

  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    const startTime = Date.now();
    const cachedMarkets = this.store[exchangeCode];

    if (cachedMarkets) {
      logger.info(
        `MemoryCacheProvider: Fetched ${Object.keys(cachedMarkets).length} markets on ${exchangeCode} from cache`,
      );

      return cachedMarkets;
    }

    const markets = await ccxtExchange.loadMarkets();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logger.info(
      `MemoryCacheProvider: Fetched ${Object.keys(markets).length} markets on ${exchangeCode} exchange in ${duration}s`,
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
