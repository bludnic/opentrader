import { AxiosRequestConfig } from "axios";

export function setApiKeyHeaderInterceptor(config: AxiosRequestConfig) {
  config.headers = {
    ...config.headers,
    ["X-CMC_PRO_API_KEY"]: process.env
      .NEXT_PUBLIC_COINMARKETCAP_API_KEY as string,
  };

  return config;
}
