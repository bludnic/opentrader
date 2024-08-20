import { decomposeSymbol } from "./decomposeSymbol.js";

export function getQuoteCurrency(symbol: string) {
  const { quoteCurrency } = decomposeSymbol(symbol);

  return quoteCurrency;
}
