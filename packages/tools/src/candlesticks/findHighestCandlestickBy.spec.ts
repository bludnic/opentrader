import { findHighestCandlestickBy } from "./findHighestCandlestickBy";
import { CANDLESTICKS } from "src/mocks/candlesticks";

describe("findHighestCandlestickBy", () => {
  it("highest by close", () => {
    expect(findHighestCandlestickBy("close", CANDLESTICKS)).toEqual(
      CANDLESTICKS[0]
    );
  });

  it("highest by open", () => {
    expect(findHighestCandlestickBy("open", CANDLESTICKS)).toEqual(
      CANDLESTICKS[2]
    );
  });

  it("highest by low", () => {
    expect(findHighestCandlestickBy("low", CANDLESTICKS)).toEqual(
      CANDLESTICKS[2]
    );
  });
});
