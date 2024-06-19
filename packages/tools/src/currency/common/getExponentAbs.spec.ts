import { getExponentAbs } from "./getExponentAbs.js";

describe("getExponentAbs", () => {
  it("with trailing zeros", () => {
    expect(getExponentAbs("0.00100000")).toBe(3);
  });

  it("with zero gaps", () => {
    expect(getExponentAbs("0.00202")).toBe(3);
  });

  it("small decimals", () => {
    expect(getExponentAbs("0.1")).toBe(1);
  });

  it("no decimals as float", () => {
    expect(getExponentAbs("1.0")).toBe(0);
  });

  it("no decimals as a real", () => {
    expect(getExponentAbs("1")).toBe(0);
  });

  it("using number type", () => {
    expect(getExponentAbs(0.01)).toBe(2);
  });

  it("with scientific notation", () => {
    expect(getExponentAbs(1e-8)).toBe(8);
  });
});
