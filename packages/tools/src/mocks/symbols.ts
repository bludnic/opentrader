import type { ISymbolFilter } from "@opentrader/types";

export const ETH_SYMBOL_FILTER: ISymbolFilter = {
  precision: {
    amount: 0.000001,
    price: 0.01,
  },
  decimals: {
    amount: 6,
    price: 2,
  },
  limits: {
    amount: {
      min: 0.00001,
      max: undefined,
    },
    price: {
      min: undefined,
      max: undefined,
    },
    cost: {
      min: undefined,
      max: 1000000,
    },
    leverage: {
      min: 1,
      max: 10,
    },
  },
};
