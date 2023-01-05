import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateExchangeAccountRequestBodyDto,
  CreateExchangeAccountResponseBodyDto,
  ExchangeAccountDto,
  GetBotResponseBodyDto,
  GetExchangeAccountsResponseBodyDto,
  UpdateExchangeAccountRequestBodyDto,
  UpdateExchangeAccountResponseBodyDto,
} from "src/lib/bifrost/client";

export const exchangeAccountsApi = createApi({
  reducerPath: "exchangeAccountsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/exchange-accounts`,
    headers: {
      Authorization: "Bearer master_trader_99", // harcoded
    },
  }),
  endpoints: (builder) => ({
    getExchanges: builder.query<GetExchangeAccountsResponseBodyDto, void>({
      query: () => ({
        url: "/accounts",
        headers: {
          Authorization: "Bearer master_trader_99", // harcoded
        },
      }),
    }),
    getExchange: builder.query<GetBotResponseBodyDto, ExchangeAccountDto["id"]>(
      {
        query: (accountId) => ({
          url: `/account/${accountId}`,
          headers: {
            Authorization: "Bearer master_trader_99", // harcoded
          },
        }),
      }
    ),
    createAccount: builder.mutation<
      CreateExchangeAccountResponseBodyDto,
      CreateExchangeAccountRequestBodyDto
    >({
      query: (body) => ({
        url: "/account",
        method: "POST",
        headers: {
          Authorization: "Bearer master_trader_99", // harcoded
        },
        body,
      }),
    }),
    updateAccount: builder.mutation<
      UpdateExchangeAccountResponseBodyDto,
      {
        accountId: ExchangeAccountDto["id"];
        body: UpdateExchangeAccountRequestBodyDto;
      }
    >({
      query: (params) => {
        const { accountId, body } = params;

        return {
          url: `/account/${accountId}`,
          method: "PUT",
          headers: {
            Authorization: "Bearer master_trader_99", // harcoded
          },
          body,
        };
      },
    }),
  }),
});

const {
  useGetExchangesQuery,
  useLazyGetExchangeQuery,

  useGetExchangeQuery,
  useLazyGetExchangesQuery,

  useCreateAccountMutation,
  useUpdateAccountMutation,
} = exchangeAccountsApi;

export {
  useGetExchangesQuery,
  useLazyGetExchangeQuery,
  useGetExchangeQuery,
  useLazyGetExchangesQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
};
