import { ExchangeCode } from "@opentrader/types";
import { isValidExchangeCode } from "./isValidExchangeCode";

describe("isValidExchangeCode", () => {
  it("test valid `exchangeCode`", () => {
    expect(isValidExchangeCode(ExchangeCode.OKX)).toBe(true);
  });

  it("test invalid `exchangeCode`", () => {
    expect(isValidExchangeCode("DDD" as ExchangeCode)).toBe(false);
  });
});
