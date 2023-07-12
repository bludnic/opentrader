import axios, { AxiosPromise } from "axios";
import backtestingResponse from './backtesting-response.json';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BIFROST_API_BASEURL,
});

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
  side: 'buy' | 'sell',
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
  candlesHistory(): AxiosPromise<{ candles: ICandlestick[] }>  {
    return client.get("/backtesting/candlesticks-UNI-USDT")
  },
  backtesting(): AxiosPromise<{
    candles: ICandlestick[],
    trades: Trade[],
    finishedSmartTradesCount: number,
    totalProfit: number
  }>  {
    return client.get("/backtesting/candlesticks-UNI-USDT").then(res => {
      res.data = backtestingResponse
      return res;
    })
  },
};
