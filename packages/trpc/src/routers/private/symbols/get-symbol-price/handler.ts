import { exchangeProvider } from "@opentrader/exchanges";
import { decomposeSymbolId } from "@opentrader/tools";
import type { Context } from "../../../../utils/context";
import type { TGetSymbolPriceInputSchema } from "./schema";

type Options = {
  ctx: Context;
  input: TGetSymbolPriceInputSchema;
};

export async function getSymbolPrice(opts: Options) {
  const { input } = opts;

  const { exchangeCode, currencyPairSymbol } = decomposeSymbolId(
    input.symbolId,
  );
  const exchangeService = exchangeProvider.fromCode(exchangeCode);

  const price = await exchangeService.getMarketPrice({
    symbol: currencyPairSymbol,
  });

  return price;
}
