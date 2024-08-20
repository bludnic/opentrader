import { decomposeSymbol } from "./decomposeSymbol.js";

export function getBaseCurrency(symbol: string) {
  const { baseCurrency } = decomposeSymbol(symbol);

  return baseCurrency;
}
