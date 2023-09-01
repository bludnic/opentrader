import { RouterOutput } from "src/lib/trpc/types";

export type TExchangeAccount =
  RouterOutput["exchangeAccount"]["list"]["exchangeAccounts"][number];
