import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ICandlestick } from "@opentrader/types";

import { rsi } from "./rsi.js";

const loadCandles = (filename: string): ICandlestick[] => {
  return JSON.parse(readFileSync(join(__dirname, `./__mocks__/${filename}`), "utf-8"));
};

describe("rsi", () => {
  const candles: ICandlestick[] = loadCandles("ETH_USDT-1d-candles.json");
  const candles1h: ICandlestick[] = loadCandles("ETH_USDT-1h-candles.json");

  it("should calculate RSI", async () => {
    const result = await rsi({ periods: 14 }, candles);

    expect(result).toMatchSnapshot();
  });

  it("should throw an error if there a less than 2 periods", async () => {
    await expect(rsi({ periods: 1 }, candles)).rejects.toThrow("RSI requires at least 2 periods");
  });

  it("should throw an error if no candles provided", async () => {
    await expect(rsi({ periods: 14 }, [])).rejects.toThrow("No candles provided");
  });

  it("the length of RSI values must be equal to the number of candles", async () => {
    const rsiValues = await rsi({ periods: 14 }, candles);
    expect(rsiValues.length).toBe(candles.length);

    const rsiValues2 = await rsi({ periods: 14 }, candles.slice(0, 1));
    expect(rsiValues2.length).toBe(1);
  });

  // it("should start calculating RSI values from the last candle", async () => {
  //   const rsiValues = await rsi({ periods: 7 }, candles.slice(0, 7));
  //   const lastRsiValue = rsiValues[rsiValues.length - 1];
  //
  //   expect(lastRsiValue).not.toBeNaN();
  // });

  it("should calculate RSI for 1h candles", async () => {
    const result = await rsi({ periods: 14 }, candles1h);

    expect(result).toMatchSnapshot();
  });
});
