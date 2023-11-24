import { ExchangeCode } from "@opentrader/types";
import type { DecomposeSymbolIdResult } from "./decomposeSymbolId";
import { decomposeSymbolId } from "./decomposeSymbolId";

describe("decomposeSymbolId", () => {
  it("decompose valid symbol", () => {
    const expectedResult: DecomposeSymbolIdResult = {
      exchangeCode: ExchangeCode.OKX,
      currencyPairSymbol: "BTC/USDT",
      baseCurrency: "BTC",
      quoteCurrency: "USDT",
    };

    expect(decomposeSymbolId("OKX:BTC/USDT")).toEqual(expectedResult);
  });

  it("should throw an error when symbol is not valid", () => {
    expect(() => decomposeSymbolId("OKX:BTCUSDT")).toThrowError();
  });
});
