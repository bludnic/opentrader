export const ExchangeCode = {
  OKX: "OKX",
} as const;

export type ExchangeCode = (typeof ExchangeCode)[keyof typeof ExchangeCode];
