import { AxiosRequestConfig } from "axios";
import { getAuthToken } from "src/utils/auth/getAuthToken";

export const authInterceptor = (
  config: AxiosRequestConfig
): AxiosRequestConfig => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };
};
