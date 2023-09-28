import { decomposeSymbolId } from "@bifrost/tools";
import { GridBotFormState } from "src/sections/grid-bot/create-bot/store/bot-form";
import { TGridBotCreateInput } from "src/types/trpc";

export function mapFormToDto(state: GridBotFormState): TGridBotCreateInput {
  const { gridLines, symbolId, exchangeAccountId } = state;

  const { baseCurrency, quoteCurrency } = decomposeSymbolId(symbolId);

  return {
    exchangeAccountId,
    data: {
      name: `[${baseCurrency}/${quoteCurrency}] Long Bot`,
      settings: {
        gridLines,
      },
      baseCurrency,
      quoteCurrency,
    },
  };
}
