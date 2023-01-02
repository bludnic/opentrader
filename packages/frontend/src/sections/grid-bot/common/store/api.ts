import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetBotResponseBodyDto,
  GetBotsListResponseDto,
  GridBotDto,
} from "src/lib/bifrost/client";

// Define a service using a base URL and expected endpoints
export const gridBotsApi = createApi({
  reducerPath: "gridBotsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/grid-bot`,
    headers: {
      Authorization: "Bearer master_trader_99", // harcoded
    },
  }),
  endpoints: (builder) => ({
    getBots: builder.query<GetBotsListResponseDto, void>({
      query: () => ({
        url: "",
        headers: {
          Authorization: "Bearer master_trader_99", // harcoded
        },
      }),
    }),
    getBot: builder.query<GetBotResponseBodyDto, GridBotDto["id"]>({
      query: (botId) => ({
        url: `/info/${botId}`,
        headers: {
          Authorization: "Bearer master_trader_99", // harcoded
        },
      }),
    }),
    startBot: builder.mutation<void, Pick<GridBotDto, "id">>({
      query: (body) => ({
        url: `/start/${body.id}`,
        method: "PUT",
        body,
      }),
    }),
    stopBot: builder.mutation<void, Pick<GridBotDto, "id">>({
      query: (body) => ({
        url: `/stop/${body.id}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

const { useGetBotsQuery, useGetBotQuery, useLazyGetBotQuery } = gridBotsApi;

export { useGetBotsQuery, useGetBotQuery, useLazyGetBotQuery };
