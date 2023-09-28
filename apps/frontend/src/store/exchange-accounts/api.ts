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
    getExchangeAccounts: builder.query<
      GetExchangeAccountsResponseBodyDto,
      void
    >({
      query: () => ({
        url: "/accounts",
      }),
    }),
    getExchangeAccount: builder.query<
      GetExchangeAccountResponseBodyDto,
      ExchangeAccountDto["id"]
    >({
      query: (accountId) => ({
        url: `/account/${accountId}`,
      }),
    }),
    createExchangeAccount: builder.mutation<
      CreateExchangeAccountResponseBodyDto,
      CreateExchangeAccountRequestBodyDto
    >({
      query: (body) => ({
        url: "/account",
        method: "POST",
        body,
      }),
    }),
    updateExchangeAccount: builder.mutation<
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
  useGetExchangeAccountsQuery,
  useLazyGetExchangeAccountQuery,

  useGetExchangeAccountQuery,
  useLazyGetExchangeAccountsQuery,

  useCreateExchangeAccountMutation,
  useUpdateExchangeAccountMutation,
} = exchangeAccountsApi;

export {
  useGetExchangeAccountsQuery,
  useLazyGetExchangeAccountQuery,
  useGetExchangeAccountQuery,
  useLazyGetExchangeAccountsQuery,
  useCreateExchangeAccountMutation,
  useUpdateExchangeAccountMutation,
};
