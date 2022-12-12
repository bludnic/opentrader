import axios, { AxiosPromise } from "axios";
import { setApiKeyHeaderInterceptor } from "./utils/setApiKeyHeaderInterceptor";
import { CMCCoin } from "src/lib/coinmarketcap/types";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COINMARKETCAP_API_BASEURL,
});
client.interceptors.request.use(setApiKeyHeaderInterceptor);

export const coinMarketCapApi = {
  getCryptocurrencyMap(): AxiosPromise<{ status: number; data: CMCCoin[] }> {
    return client.get("/cryptocurrency/map");
  },
};
