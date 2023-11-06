import { TSymbol } from "src/types/trpc";

export function generateBotName(symbol: TSymbol) {
  return `[${symbol.symbolId}] Long Bot`;
}
