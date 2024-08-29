import { describe, expect, it } from "vitest";
import { CANDLESTICKS } from "../mocks/candlesticks.js";
import { findLowestCandlestickBy } from "./findLowestCandlestickBy.js";

describe("findLowestCandlestickBy", () => {
  it("lowest by close", () => {
    expect(findLowestCandlestickBy("close", CANDLESTICKS)).toEqual(CANDLESTICKS[2]);
  });

  it("lowest by open", () => {
    expect(findLowestCandlestickBy("open", CANDLESTICKS)).toEqual(CANDLESTICKS[1]);
  });

  it("lowest by low", () => {
    expect(findLowestCandlestickBy("low", CANDLESTICKS)).toEqual(CANDLESTICKS[0]);
  });
});
