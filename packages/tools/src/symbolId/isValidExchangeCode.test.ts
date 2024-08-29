import { describe, expect, it } from "vitest";
import { ExchangeCode } from "@opentrader/types";
import { isValidExchangeCode } from "./isValidExchangeCode.js";

describe("isValidExchangeCode", () => {
  it("test valid `exchangeCode`", () => {
    expect(isValidExchangeCode(ExchangeCode.OKX)).toBe(true);
  });

  it("test invalid `exchangeCode`", () => {
    expect(isValidExchangeCode("DDD" as ExchangeCode)).toBe(false);
  });
});
