import { describe, expect, it } from "vitest";
import { ExchangeCode } from "@opentrader/types";
import type { DecomposeSymbolIdResult } from "./decomposeSymbolId.js";
import { decomposeSymbolId } from "./decomposeSymbolId.js";

describe("decomposeSymbolId", () => {
  it("decompose valid symbol on SPOT", () => {
    const expectedResult: DecomposeSymbolIdResult = {
      exchangeCode: ExchangeCode.OKX,
      currencyPairSymbol: "BTC/USDT",
      baseCurrency: "BTC",
      quoteCurrency: "USDT",
    };

    expect(decomposeSymbolId("OKX:BTC/USDT")).toEqual(expectedResult);
  });

  it("decompose a valid symbol on FUTURES", () => {
    const expectedResult: DecomposeSymbolIdResult = {
      exchangeCode: ExchangeCode.OKX,
      currencyPairSymbol: "BTC/USDT:USDT",
      baseCurrency: "BTC",
      quoteCurrency: "USDT",
    };

    expect(decomposeSymbolId("OKX:BTC/USDT:USDT")).toEqual(expectedResult);
  });

  it("should throw an error when symbol is not valid", () => {
    expect(() => decomposeSymbolId("OKX:BTCUSDT")).toThrowError();
  });
});
