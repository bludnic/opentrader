import { decomposeSymbolId } from "@bifrost/tools";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TSymbol } from "src/types/trpc";

// @todo move TRPC selectors to a separate place
export const selectSymbolById = (symbolId: string): TSymbol => {
  const { exchangeCode } = decomposeSymbolId(symbolId);
  const symbols = trpcApi.symbol.list.selectOrThrow(exchangeCode);

  const symbol = symbols.find(
    (symbol) => symbol.symbolId === symbolId,
  ) as TSymbol; // @todo approach when is undefined

  return symbol;
};
