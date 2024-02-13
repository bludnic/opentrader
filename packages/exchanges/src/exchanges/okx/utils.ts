export function toExchangeSymbol(symbol: string) {
  const [baseCurrency, quoteCurrency] = symbol.split("/");

  return `${baseCurrency}-${quoteCurrency}`;
}

export function fromExchangeSymbol(symbol: string) {
  const [baseCurrency, quoteCurrency] = symbol.split("-");

  return `${baseCurrency}/${quoteCurrency}`;
}
