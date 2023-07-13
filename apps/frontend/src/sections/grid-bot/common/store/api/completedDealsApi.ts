import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetCompletedDealsResponseBodyDto,
  GridBotDto,
} from "src/lib/bifrost/client";
import { prepareAuthHeaderHandler } from "src/utils/rtk/prepareAuthHeaderHandler";

// Define a service using a base URL and expected endpoints
export const gridBotCompletedDealsApi = createApi({
  reducerPath: "gridBotCompletedDealsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/grid-bot`,
    prepareHeaders: prepareAuthHeaderHandler,
  }),
  endpoints: (builder) => ({
    getCompletedDeals: builder.query<
      GetCompletedDealsResponseBodyDto,
      GridBotDto["id"]
    >({
      query: (botId) => ({
        url: `/${botId}/completed-deals`,
      }),
    }),
  }),
});

const { useGetCompletedDealsQuery, useLazyGetCompletedDealsQuery } =
  gridBotCompletedDealsApi;

export { useGetCompletedDealsQuery, useLazyGetCompletedDealsQuery };
