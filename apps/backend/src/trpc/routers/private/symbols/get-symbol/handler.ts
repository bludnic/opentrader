import { exchanges } from '@opentrader/exchanges';
import { decomposeSymbolId } from '@opentrader/tools';

import { Context } from 'src/trpc/utils/context';
import { TGetSymbolInputSchema } from './schema';

type Options = {
  ctx: Context;
  input: TGetSymbolInputSchema;
};

export async function getSymbol(opts: Options) {
  const { input } = opts;

  const { exchangeCode, currencyPairSymbol } = decomposeSymbolId(
    input.symbolId,
  );
  const exchangeService = exchanges[exchangeCode]();

  const symbol = await exchangeService.getSymbol({
    currencyPair: currencyPairSymbol,
  });

  return symbol;
}
