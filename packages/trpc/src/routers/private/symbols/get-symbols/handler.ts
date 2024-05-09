import { exchangeProvider } from "@opentrader/exchanges";
import type { Context } from "../../../../utils/context";
import type { TGetSymbolsInputSchema } from "./schema";

type Options = {
  ctx: Context;
  input: TGetSymbolsInputSchema;
};

export async function getSymbols(opts: Options) {
  const { input: exchangeCode } = opts;
  const exchangeService = exchangeProvider.fromCode(exchangeCode);

  const symbols = await exchangeService.getSymbols();

  return symbols;
}
