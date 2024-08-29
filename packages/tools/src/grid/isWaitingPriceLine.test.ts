import { describe, expect, it } from "vitest";
import { isWaitingPriceLine } from "./isWaitingPriceLine.js";

const priceLines = [1, 3, 2, 4, 5];

describe("isWaitingPriceline", () => {
  it("should throw an error when `priceLines` does not contain provided `priceLine`", () => {
    expect(() => isWaitingPriceLine(4, [1, 2, 3], 1)).toThrow(Error);
  });

  it("with exact price", () => {
    expect(isWaitingPriceLine(3, priceLines, 3)).toBe(true);
  });

  it("near the `currentAssetPrice`", () => {
    expect(isWaitingPriceLine(3, priceLines, 2.9)).toBe(true);

    expect(isWaitingPriceLine(3, priceLines, 2.6)).toBe(true);
  });

  it("should pick upper `priceLine` when `currentAssetPrice` is at the edge of two grid lines", () => {
    expect(isWaitingPriceLine(3, priceLines, 2.5)).toBe(true);
    expect(isWaitingPriceLine(2, priceLines, 2.5)).toBe(false);
  });
});
