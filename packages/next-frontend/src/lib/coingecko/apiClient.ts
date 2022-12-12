import axios, { AxiosPromise } from "axios";
import { CoinsApiFactory } from "src/lib/coingecko/client";
import { CGMarketChartPrice } from "src/lib/coingecko/types";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COINGECKO_API_BASEURL,
});

const coinsApi = CoinsApiFactory(undefined, "", client);

export const coingeckoApi = {
  getCoinsList() {
    return coinsApi.coinsListGet();
  },
  /**
   * Get historical market data include price, market cap, and 24h volume (granularity auto)
   * Minutely data will be used for duration within 1 day, Hourly data will be used for duration between 1 day and 90 days, Daily data will be used for duration above 90 days.
   *
   * @param baseCurrency Base currency (e.g. bitcoin)
   * @param quoteCurrency The target currency of market data (e.g. usd, eur, jpy, etc.)
   * @param daysAgo Data up to number of days ago (e.g. 1, 14, 30, max)
   * @param interval Data interval. Possible value: daily
   */
  getMarketChartHistory(
    baseCurrency: string,
    quoteCurrency: string,
    daysAgo: string,
    interval: "daily" = "daily"
  ): AxiosPromise<{ prices: CGMarketChartPrice[] }> {
    return client.get(
      "/coins/{id}/market_chart".replace("{id}", baseCurrency),
      {
        params: {
          vs_currency: quoteCurrency,
          days: daysAgo,
          interval,
        },
      }
    );
  },
};
