import { decomposeSymbolId } from "@bifrost/tools";
import { CreateBotRequestBodyDto } from "src/lib/bifrost/client";
import { GridBotFormState } from "src/sections/grid-bot/create-bot/store/bot-form";

export function mapFormToDto(state: GridBotFormState): CreateBotRequestBodyDto {
  const { gridLines, currencyPair, exchangeAccountId } = state;

  const { baseCurrency, quoteCurrency } = decomposeSymbolId(currencyPair);

  return {
    gridLines,
    id: `BTC_USDT__DEMO`, // @todo remove from DTO
    name: `[BTC/USDT] Test Bot #2`, // @todo remove from DTO
    baseCurrency,
    quoteCurrency,
    exchangeAccountId,
  };
}
