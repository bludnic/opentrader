import { ETH_SYMBOL_FILTER } from "../mocks/symbols.js";
import { filterPrice } from "./filterPrice.js";

describe("filterPrice", () => {
  it("should transform to fixed decimal points", () => {
    expect(filterPrice("17.514076666666668", ETH_SYMBOL_FILTER)).toBe("17.51");
  });

  it("should remove trailing zero", () => {
    expect(filterPrice("17.20000", ETH_SYMBOL_FILTER)).toBe("17.2");
  });

  it("should remove decimals points when is an integer", () => {
    expect(filterPrice("17.00000", ETH_SYMBOL_FILTER)).toBe("17");
  });

  it("with argument type number", () => {
    expect(filterPrice(17.514, ETH_SYMBOL_FILTER)).toBe("17.51");
  });
});
