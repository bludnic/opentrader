import type { InternalAxiosRequestConfig } from "axios";
import { getAuthToken } from "src/utils/auth/getAuthToken";

export const authInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  config.headers.set("Authorization", `Bearer ${getAuthToken()}`);

  return config;
};
