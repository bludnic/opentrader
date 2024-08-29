import { describe, expect, it } from "vitest";
import { countDecimalPlaces } from "./countDecimalPlaces.js";

describe(countDecimalPlaces.name, () => {
  it("with trailing zeros", () => {
    expect(countDecimalPlaces("0.06900")).toBe(5);
  });

  it("ignore trailing zeros", () => {
    expect(
      countDecimalPlaces("0.06900", {
        ignoreTrailingZeros: true,
      }),
    ).toBe(3);
  });

  it("with type number", () => {
    expect(countDecimalPlaces(0.069)).toBe(3);
  });
});
