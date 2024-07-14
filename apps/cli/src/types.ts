import type { ExchangeAccount, Bot } from "@prisma/client";

export type CommandResult<T = unknown> = {
  result: T;
};

export type ExchangeConfig = Pick<
  ExchangeAccount,
  | "name"
  | "apiKey"
  | "secretKey"
  | "password"
  | "exchangeCode"
  | "isDemoAccount"
>;

export type BotConfig<S = any> = Partial<
  Pick<Bot, "name" | "type" | "timeframe" | "label">
> &
  Pick<Bot, "template"> & {
    /**
     * Strategy params
     */
    settings: S;
    /**
     * Exchange account label.
     * This label should match the key in the exchanges config file (exchanges.json5).
     */
    exchange: string;
    /**
     * Trading pair
     */
    pair: string;
  };
