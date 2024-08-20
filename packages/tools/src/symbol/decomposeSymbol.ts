export function decomposeSymbol(symbol: string) {
  const [baseCurrency = "NONE", quoteCurrency = "NONE"] = symbol.split("/");

  return {
    baseCurrency,
    quoteCurrency,
  };
}
