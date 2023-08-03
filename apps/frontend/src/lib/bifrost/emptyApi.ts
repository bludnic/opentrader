// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RTK_API_NAME } from "src/lib/bifrost/constants";
import { prepareAuthHeaderHandler } from "src/utils/rtk/prepareAuthHeaderHandler";

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptyApi = createApi({
  reducerPath: RTK_API_NAME,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BIFROST_HOSTNAME,
    prepareHeaders: prepareAuthHeaderHandler,
  }),
  endpoints: () => ({}),
});
