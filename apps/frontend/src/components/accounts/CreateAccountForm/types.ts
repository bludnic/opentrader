import type { RouterInput } from "src/lib/trpc/types";

export type CreateExchangeAccountFormValues =
  RouterInput["exchangeAccount"]["create"];

export type UpdateExchangeAccountFormValues =
  RouterInput["exchangeAccount"]["update"]["body"];
