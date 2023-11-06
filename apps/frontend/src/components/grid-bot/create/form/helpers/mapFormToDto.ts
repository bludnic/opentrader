import { decomposeSymbolId } from "@opentrader/tools";
import { GridBotFormState } from "src/sections/grid-bot/create-bot/store/bot-form";
import { TGridBotCreateInput } from "src/types/trpc";

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
