import { isValidSymbol } from "./isValidSymbol.js";

describe("isValidSymbol", () => {
  it("test existing exchange with a valid currency pair", () => {
    expect(isValidSymbol("BTC/USDT")).toBe(true);
  });

  it("test existing exchange with a non-valid currency pair", () => {
    expect(isValidSymbol("BTCUSDT")).toBe(false);
  });

  it("test existing exchange with a symbol starting with a number", () => {
    expect(isValidSymbol("1INCH/USDT")).toBe(true);
  });
});
