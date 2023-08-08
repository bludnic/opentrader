import {
  BASE_CURRENCY_INVESTMENT,
  GRID_LEVELS,
  QUOTE_CURRENCY_INVESTMENT,
} from "src/mocks/grid-bot";
import { calculateInvestment } from "./calculateInvestment";

describe("calculateInvestment", () => {
  it("should calculate investment", () => {
    const expectedResult = {
      baseCurrencyAmount: BASE_CURRENCY_INVESTMENT,
      quoteCurrencyAmount: QUOTE_CURRENCY_INVESTMENT,
    };

    expect(calculateInvestment(GRID_LEVELS)).toStrictEqual(expectedResult);
  });
});
