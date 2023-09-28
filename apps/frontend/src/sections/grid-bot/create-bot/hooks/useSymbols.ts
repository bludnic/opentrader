import { trpcApi } from "src/lib/trpc/endpoints";
import { selectExchangeCode } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";

export function useSymbols() {
  const exchangeCode = useAppSelector(selectExchangeCode);

  const { data } = trpcApi.symbol.list.useQuery({
    input: exchangeCode,
  });

  return data || [];
}
