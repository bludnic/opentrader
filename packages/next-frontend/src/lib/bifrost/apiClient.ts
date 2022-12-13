import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BIFROST_API_BASEURL,
});

export const bifrostApi = {
  okxMarketPriceCandles() {
    return client.get('/okex/market/mark-price-candles')
  },
  okxMarketTrades() {
    return client.get("/okex/market/trades");
  },
};
