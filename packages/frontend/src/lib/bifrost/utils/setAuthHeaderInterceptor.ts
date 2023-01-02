import { AxiosRequestConfig } from "axios";

export function setAuthHeaderInterceptor(config: AxiosRequestConfig) {
  config.headers = {
    ...config.headers,
    ["Authorization"]: 'Bearer master_trader_99', // this is master key
  };

  return config;
}
