import type { ISymbolFilter } from "@opentrader/types";

export const ETH_SYMBOL_FILTER: ISymbolFilter = {
  // OKX:ETH/USDT
  price: {
    tickSize: "0.01",
    minPrice: null,
    maxPrice: null,
  },
  lot: {
    stepSize: "0.000001",
    minQuantity: "0.0001",
    maxQuantity: "999999999999",
  },
};
