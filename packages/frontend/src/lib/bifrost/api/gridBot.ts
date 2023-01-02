import axios, { AxiosPromise } from "axios";
import {
  GetBotResponseBodyDto,
  GetBotsListResponseDto,
  GetCompletedDealsResponseBodyDto,
} from "src/lib/bifrost/client";
import { setAuthHeaderInterceptor } from "src/lib/bifrost/utils/setAuthHeaderInterceptor";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BIFROST_API_BASEURL,
});
client.interceptors.request.use(setAuthHeaderInterceptor);

export const gridBotApi = {
  getBot(botId: string): AxiosPromise<GetBotResponseBodyDto> {
    return client.get(`/grid-bot/info/${botId}`);
  },
  getBots(): AxiosPromise<GetBotsListResponseDto> {
    return client.get(`/grid-bot`);
  },
  getCompletedDeals(
    botId: string
  ): AxiosPromise<GetCompletedDealsResponseBodyDto> {
    return client.get(`/grid-bot/${botId}/completed-deals`);
  },
};
