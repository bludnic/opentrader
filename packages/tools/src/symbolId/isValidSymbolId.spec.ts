import { isValidSymbolId } from "./isValidSymbolId";

describe("isValidSymbolId", () => {
  it("test existing exchange with a valid currency pair", () => {
    expect(isValidSymbolId("OKX:BTC/USDT")).toBe(true);
  });

  it("test existing exchange with a non-valid currency pair", () => {
    expect(isValidSymbolId("OKX:BTCUSDT")).toBe(false);
  });

  it("test non-existing exchange with a valid currency pair", () => {
    expect(isValidSymbolId("UNK:BTC/USDT")).toBe(false);
  });

  it("test existing exchange with a symbol starting with a number", () => {
    expect(isValidSymbolId("OKX:1INCH/USDT")).toBe(true);
  });
});
