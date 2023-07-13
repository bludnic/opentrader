import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { getAuthToken } from "src/utils/auth/getAuthToken";
import { setAuthHeader } from "./setAuthHeader";

export const prepareAuthHeaderHandler: FetchBaseQueryArgs["prepareHeaders"] = (
  headers
) => {
  const authToken = getAuthToken();

  if (authToken) {
    setAuthHeader(authToken, headers);
  }

  return headers;
};
