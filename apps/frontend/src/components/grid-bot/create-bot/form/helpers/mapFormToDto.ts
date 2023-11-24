import { decomposeSymbolId } from "@opentrader/tools";
import type { GridBotFormState } from "src/store/bot-form";
import type { TGridBotCreateInput } from "src/types/trpc";

export function mapFormToDto(state: GridBotFormState): TGridBotCreateInput {
  const { gridLines, symbolId, exchangeAccountId, botName } = state;

  const { baseCurrency, quoteCurrency } = decomposeSymbolId(symbolId);

  return {
    exchangeAccountId,
    data: {
      name: botName,
      settings: {
        gridLines,
      },
      baseCurrency,
      quoteCurrency,
    },
  };
}
