export const ExchangeCode = {
  OKX: "OKX",
  BYBIT: "BYBIT",
  BINANCE: "BINANCE",
  KRAKEN: "KRAKEN",
  COINBASE: "COINBASE",
  GATEIO: "GATEIO",
} as const;

export type ExchangeCode = (typeof ExchangeCode)[keyof typeof ExchangeCode];
