import type { ExchangeAccount } from "@prisma/client";

export type ConfigName = "default" | "dev" | "prod";

export type CommandResult<T = unknown> = {
  result: T;
};

export type ExchangeConfig = Pick<
  ExchangeAccount,
  "name" | "apiKey" | "secretKey" | "password" | "exchangeCode"
>;
