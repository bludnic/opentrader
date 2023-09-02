import { exchanges } from '@bifrost/exchanges';
import { Context } from 'src/trpc/utils/context';
import { TGetSymbolsInputSchema } from './schema';

type Options = {
  ctx: Context;
  input: TGetSymbolsInputSchema;
};

export async function getSymbols(opts: Options) {
  const { input: exchangeCode } = opts;
  const exchangeService = exchanges[exchangeCode]();

  const symbols = await exchangeService.getSymbols();

  return {
    symbols,
  };
}
