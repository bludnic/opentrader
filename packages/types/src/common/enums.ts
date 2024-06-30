export const BarSize = {
  ONE_MINUTE: "1m",
  FIVE_MINUTES: "5m",
  FIFTEEN_MINUTES: "15m",
  ONE_HOUR: "1h",
  FOUR_HOURS: "4h",
  ONE_DAY: "1d",
  ONE_WEEK: "1w",
  ONE_MONTH: "1M",
  THREE_MONTHS: "3M",
} as const;

export type BarSize = (typeof BarSize)[keyof typeof BarSize];

export const ExchangeCode = {
  OKX: "OKX",
  BYBIT: "BYBIT",
  BINANCE: "BINANCE",
  KRAKEN: "KRAKEN",
  COINBASE: "COINBASE",
  GATEIO: "GATEIO",
} as const;

export type ExchangeCode = (typeof ExchangeCode)[keyof typeof ExchangeCode];
