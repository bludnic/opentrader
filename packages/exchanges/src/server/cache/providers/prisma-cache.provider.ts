import { Dictionary, Exchange, Market } from "ccxt";
import { ExchangeCode } from "@opentrader/types";
import { Prisma, xprisma } from "@opentrader/db";
import { ICacheProvider } from "src/types/cache/cache-provider.interface";

export class PrismaCacheProvider implements ICacheProvider {
  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    const cachedMarkets = await xprisma.markets.findUnique({
      where: {
        exchangeCode,
      },
    });

    if (cachedMarkets) {
      console.log(`PrismaCache(${exchangeCode}): from cache`);
      return cachedMarkets.markets as any as Dictionary<Market>; // @todo better types
    }

    console.log(`PrismaCache(${exchangeCode}): from Exchange`);

    // If not cached, loadMarkets and cache to DB
    const markets = await ccxtExchange.loadMarkets();
    return this.cacheMarkets(markets, exchangeCode);
  }

  private async cacheMarkets(
    markets: Dictionary<Market>,
    exchangeCode: ExchangeCode,
  ) {
    await xprisma.markets.create({
      data: {
        exchangeCode,
        markets: markets as any as Prisma.InputJsonValue, // @todo better types
      },
    });
    return markets;
  }
}
