import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetCompletedSmartTradesResponseDto,
  GridBotDto,
} from "src/lib/bifrost/client";
import { prepareAuthHeaderHandler } from "src/utils/rtk/prepareAuthHeaderHandler";

// Define a service using a base URL and expected endpoints
export const gridBotCompletedSmartTradesApi = createApi({
  reducerPath: "gridBotCompletedSmartTradesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/grid-bot`,
    prepareHeaders: prepareAuthHeaderHandler,
  }),
  endpoints: (builder) => ({
    getCompletedSmartTrades: builder.query<
      GetCompletedSmartTradesResponseDto,
      GridBotDto["id"]
    >({
      query: (botId) => ({
        url: `/${botId}/completed-smart-trades`,
      }),
    }),
  }),
});

export const {
  useGetCompletedSmartTradesQuery,
  useLazyGetCompletedSmartTradesQuery,
} = gridBotCompletedSmartTradesApi;
