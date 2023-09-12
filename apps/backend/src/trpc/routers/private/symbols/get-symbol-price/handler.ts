import { exchanges } from '@bifrost/exchanges';
import { decomposeSymbolId } from '@bifrost/tools';

import { Context } from 'src/trpc/utils/context';
import { TGetSymbolPriceInputSchema } from './schema';

type Options = {
  ctx: Context;
  input: TGetSymbolPriceInputSchema;
};

export async function getSymbolPrice(opts: Options) {
  const { input } = opts;

  const { exchangeCode, currencyPairSymbol } = decomposeSymbolId(
    input.symbolId,
  );
  const exchangeService = exchanges[exchangeCode]();

  const price = await exchangeService.getMarketPrice({
    symbol: currencyPairSymbol,
  });

  return {
    price,
  };
}
