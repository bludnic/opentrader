import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Create3CommasAccountRequestBodyDto,
  Create3CommasAccountResponseBodyDto,
  Get3CommasAccountResponseBodyDto,
  Get3CommasAccountsResponseBodyDto,
  ThreeCommasAccountDto,
  Update3CommasAccountRequestBodyDto,
  Update3CommasAccountResponseBodyDto,
} from "src/lib/bifrost/client";

export const threeCommasAccountsApi = createApi({
  reducerPath: "threeCommasAccountsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BIFROST_API_BASEURL}/3commas-accounts`,
    headers: {
      Authorization: "Bearer master_trader_99", // harcoded
    },
  }),
  endpoints: (builder) => ({
    getAccounts: builder.query<Get3CommasAccountsResponseBodyDto, void>({
      query: () => ({
        url: "/accounts",
        headers: {
          Authorization: "Bearer master_trader_99", // harcoded
        },
      }),
    }),
    getAccount: builder.query<
      Get3CommasAccountResponseBodyDto,
      ThreeCommasAccountDto["id"]
    >({
      query: (accountId) => ({
        url: `/account/${accountId}`,
        headers: {
          Authorization: "Bearer master_trader_99", // harcoded
        },
      }),
    }),
    createAccount: builder.mutation<
      Create3CommasAccountResponseBodyDto,
      Create3CommasAccountRequestBodyDto
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
      Update3CommasAccountResponseBodyDto,
      {
        accountId: ThreeCommasAccountDto["id"];
        body: Update3CommasAccountRequestBodyDto;
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
  useGetAccountsQuery,
  useLazyGetAccountsQuery,

  useGetAccountQuery,
  useLazyGetAccountQuery,

  useCreateAccountMutation,
  useUpdateAccountMutation,
} = threeCommasAccountsApi;

export {
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
  useGetAccountQuery,
  useLazyGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
};
