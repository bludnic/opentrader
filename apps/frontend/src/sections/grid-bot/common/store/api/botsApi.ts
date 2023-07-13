import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetBotResponseBodyDto,
  GetBotsListResponseDto,
  GridBotDto,
} from "src/lib/bifrost/client";
import { prepareAuthHeaderHandler } from "src/utils/rtk/prepareAuthHeaderHandler";

// Define a service using a base URL and expected endpoints
export const gridBotsApi = createApi({
  reducerPath: "gridBotsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/grid-bot`,
    prepareHeaders: prepareAuthHeaderHandler,
  }),
  endpoints: (builder) => ({
    getBots: builder.query<GetBotsListResponseDto, void>({
      query: () => ({
        url: "",
      }),
    }),
    getBot: builder.query<GetBotResponseBodyDto, GridBotDto["id"]>({
      query: (botId) => ({
        url: `/info/${botId}`,
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
