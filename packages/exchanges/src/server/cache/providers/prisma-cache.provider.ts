import type { Dictionary, Exchange, Market } from "ccxt";
import type { ExchangeCode } from "@opentrader/types";
import type { Prisma } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import type { ICacheProvider } from "../../../types/cache/cache-provider.interface.js";

export class PrismaCacheProvider implements ICacheProvider {
  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    const startTime = Date.now();

    const cachedMarkets = await xprisma.markets.findUnique({
      where: {
        exchangeCode,
      },
    });

    if (cachedMarkets) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.info(
        `PrismaCacheProvider: Fetched ${Object.keys(cachedMarkets).length} markets on ${exchangeCode} from cache in ${duration}s`,
      );

      return cachedMarkets.markets as any as Dictionary<Market>;
    }

    // If not cached, loadMarkets and cache to DB
    const markets = await ccxtExchange.loadMarkets();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.info(
      `PrismaCacheProvider: Fetched ${Object.keys(markets).length} markets on ${exchangeCode} exchange in ${duration}s`,
    );

    return this.cacheMarkets(markets, exchangeCode);
  }

  private async cacheMarkets(
    markets: Dictionary<Market>,
    exchangeCode: ExchangeCode,
  ) {
    await xprisma.markets.create({
      data: {
        exchangeCode,

        markets: markets as any as Prisma.InputJsonValue,
      },
    });
    return markets;
  }
}
