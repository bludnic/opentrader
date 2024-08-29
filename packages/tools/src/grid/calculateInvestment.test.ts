import { describe, expect, it } from "vitest";
import { BASE_CURRENCY_INVESTMENT, GRID_LEVELS, QUOTE_CURRENCY_INVESTMENT } from "../mocks/grid-bot.js";
import { calculateInvestment } from "./calculateInvestment.js";

describe("calculateInvestment", () => {
  it("should calculate investment", () => {
    const expectedResult = {
      baseCurrencyAmount: BASE_CURRENCY_INVESTMENT,
      quoteCurrencyAmount: QUOTE_CURRENCY_INVESTMENT,
    };

    expect(calculateInvestment(GRID_LEVELS)).toStrictEqual(expectedResult);
  });
});
