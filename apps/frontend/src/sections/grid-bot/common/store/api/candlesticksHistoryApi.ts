import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaderHandler } from "src/utils/rtk/prepareAuthHeaderHandler";

// Define a service using a base URL and expected endpoints
export const candlesticksHistoryApi = createApi({
  reducerPath: "candlesticksHistoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/candlesticks`,
    prepareHeaders: prepareAuthHeaderHandler,
  }),
  endpoints: (builder) => ({
    getCandlesticksHistory: builder.query<
      any, // @todo DTO response type from swagger
      { baseCurrency: string; quoteCurrency: string } // @todo types from swagger
    >({
      query: ({ baseCurrency, quoteCurrency }) => ({
        url: `/history/${baseCurrency}/${quoteCurrency}`,
      }),
    }),
  }),
});

const { useGetCandlesticksHistoryQuery, useLazyGetCandlesticksHistoryQuery } =
  candlesticksHistoryApi;

export { useGetCandlesticksHistoryQuery, useLazyGetCandlesticksHistoryQuery };
