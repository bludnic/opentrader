import { trpcApi } from "src/lib/trpc/endpoints";
import { TExchangeAccount } from "src/types/trpc";

export function useExchangeAccounts(): TExchangeAccount[] {
  const { data } = trpcApi.exchangeAccount.list.useQuery();

  return data || [];
}
