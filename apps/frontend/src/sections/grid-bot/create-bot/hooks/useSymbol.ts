import { useSymbols } from "src/sections/grid-bot/create-bot/hooks/useSymbols";
import { selectSymbolId } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";

export function useSymbol() {
  const symbolId = useAppSelector(selectSymbolId);

  const symbols = useSymbols();

  const symbol = symbols.find((symbol) => symbol.symbolId === symbolId);

  if (!symbol) {
    throw new Error("useSymbol: Normally this shouldn't happen");
  }

  return symbol;
}
