import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ICandlestick } from "@opentrader/types";

import { sma } from "./sma.js";

const loadCandles = (filename: string): ICandlestick[] => {
  return JSON.parse(readFileSync(join(__dirname, `./__mocks__/${filename}`), "utf-8"));
};

describe("sma", () => {
  const candles: ICandlestick[] = loadCandles("ETH_USDT-1d-candles.json");
  const candles1h: ICandlestick[] = loadCandles("ETH_USDT-1h-candles.json");

  it("should calculate SMA", async () => {
    const result = await sma({ periods: 14 }, candles);

    expect(result).toMatchSnapshot();
  });

  it("should throw an error if there are less than 2 periods", async () => {
    await expect(sma({ periods: 1 }, candles)).rejects.toThrow("SMA requires at least 2 periods");
  });

  it("should throw an error if no candles are provided", async () => {
    await expect(sma({ periods: 14 }, [])).rejects.toThrow("No candles provided");
  });

  it("the length of SMA values must be equal to the number of candles", async () => {
    const smaValues = await sma({ periods: 14 }, candles);
    expect(smaValues.length).toBe(candles.length);

    const smaValues2 = await sma({ periods: 14 }, candles.slice(0, 1));
    expect(smaValues2.length).toBe(1);
  });

  it("should calculate SMA for 1h candles", async () => {
    const result = await sma({ periods: 14 }, candles1h);

    expect(result).toMatchSnapshot();
  });
});
