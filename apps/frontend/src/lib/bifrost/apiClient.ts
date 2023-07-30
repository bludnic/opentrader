import { BarSize } from "@bifrost/types";
import axios, { Axios, AxiosPromise } from "axios";
import {
  CreateBotRequestBodyDto,
  GetActiveSmartTradesResponseDto,
  GetCompletedSmartTradesResponseDto,
  GetCurrentAssetPriceResponseDto,
  GetExchangeAccountsResponseBodyDto,
  GetSymbolsResponseBodyDto,
} from "src/lib/bifrost/client";
import { authInterceptor } from "src/utils/axios/authInterceptor";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BIFROST_API_BASEURL,
});
client.interceptors.request.use(authInterceptor);

export interface ICandlestick {
  open: number;
  high: number;
  low: number;
  close: number;
  /**
   * Data generation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  timestamp: number;
}

export interface Trade {
  smartTradeId: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  time: number;
}

export const bifrostApi = {
  okxMarketPriceCandles() {
    return client.get("/okex/market/mark-price-candles");
  },
  okxMarketTrades() {
    return client.get("/okex/market/trades");
  },
  candlesHistory(
    symbolId: string,
    barSize: BarSize
  ): AxiosPromise<{ candles: ICandlestick[] }> {
    return client.get(`/candlesticks/history`, {
      params: {
        symbolId,
        barSize,
      },
    });
  },
  getExchangeAccounts(): AxiosPromise<GetExchangeAccountsResponseBodyDto> {
    return client.get(`/exchange-accounts/accounts`);
  },
  getSymbols(): AxiosPromise<GetSymbolsResponseBodyDto> {
    return client.get("/symbols");
  },
  getCurrentAssetPrice(
    symbolId: string
  ): AxiosPromise<GetCurrentAssetPriceResponseDto> {
    return client.get("/symbols/current-asset-price", {
      params: {
        symbolId,
      },
    });
  },
  backtesting(): AxiosPromise<{
    candles: ICandlestick[];
    trades: Trade[];
    finishedSmartTradesCount: number;
    totalProfit: number;
  }> {
    return client.post("/backtesting/grid-bot/test", {
      botId: "ETH_USDT_BACKTESTING",
      startDate: 0,
      endDate: 0,
    });
  },
  createGridBot(body: CreateBotRequestBodyDto) {
    return client.post("/grid-bot/create", body);
  },
  getCompletedSmartTrades(
    gridBotId: string
  ): AxiosPromise<GetCompletedSmartTradesResponseDto> {
    return client.get(`/grid-bot/${gridBotId}/completed-smart-trades`);
  },
  getActiveSmartTrades(
    gridBotId: string
  ): AxiosPromise<GetActiveSmartTradesResponseDto> {
    return client.get(`/grid-bot/${gridBotId}/active-smart-trades`);
  },
};
