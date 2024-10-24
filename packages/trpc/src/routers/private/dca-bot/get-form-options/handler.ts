import { exchangeProvider } from "@opentrader/exchanges";
import { decomposeSymbolId } from "@opentrader/tools";
import type { Context } from "../../../../utils/context.js";
import type { TGetDcaBotFormOptionsInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetDcaBotFormOptionsInputSchema;
};

export async function getFormOptions({ input }: Options) {
  const { symbolId } = input;
  const { exchangeCode, currencyPairSymbol } = decomposeSymbolId(symbolId);

  const exchange = exchangeProvider.fromCode(exchangeCode);

  const { price } = await exchange.getMarketPrice({
    symbol: currencyPairSymbol,
  });

  return {
    price,
  };
}
