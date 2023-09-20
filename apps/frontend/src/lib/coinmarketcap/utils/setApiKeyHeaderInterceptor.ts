import { InternalAxiosRequestConfig } from "axios";

export function setApiKeyHeaderInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  config.headers.set(
    "X-CMC_PRO_API_KEY",
    process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY as string,
  );

  return config;
}
