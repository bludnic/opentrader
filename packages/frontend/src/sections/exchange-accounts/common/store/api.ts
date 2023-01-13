import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateExchangeAccountRequestBodyDto,
  CreateExchangeAccountResponseBodyDto,
  ExchangeAccountDto,
  GetExchangeAccountResponseBodyDto,
  GetExchangeAccountsResponseBodyDto,
  UpdateExchangeAccountRequestBodyDto,
  UpdateExchangeAccountResponseBodyDto,
} from "src/lib/bifrost/client";
import { prepareAuthHeaderHandler } from "src/utils/rtk/prepareAuthHeaderHandler";

export const exchangeAccountsApi = createApi({
  reducerPath: "exchangeAccountsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/exchange-accounts`,
    prepareHeaders: prepareAuthHeaderHandler,
  }),
  endpoints: (builder) => ({
    getExchanges: builder.query<GetExchangeAccountsResponseBodyDto, void>({
      query: () => ({
        url: "/accounts",
      }),
    }),
    getExchange: builder.query<
      GetExchangeAccountResponseBodyDto,
      ExchangeAccountDto["id"]
    >({
      query: (accountId) => ({
        url: `/account/${accountId}`,
      }),
    }),
    createAccount: builder.mutation<
      CreateExchangeAccountResponseBodyDto,
      CreateExchangeAccountRequestBodyDto
    >({
      query: (body) => ({
        url: "/account",
        method: "POST",
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
