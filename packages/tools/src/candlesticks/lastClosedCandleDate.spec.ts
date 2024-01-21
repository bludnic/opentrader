import { lastClosedCandleDate } from "./lastClosedCandleDate";

describe("lastClosedCandleDate", () => {
  it("should return the correct date for each bar size", () => {
    expect(
      lastClosedCandleDate(
        new Date("2023-01-21T01:00:00.000Z").getTime(),
        "1m",
      ),
    ).toBe("2023-01-21T00:59:00.000Z");
  });

  it("should return the correct date for 1m bar size with milliseconds", () => {
    expect(
      lastClosedCandleDate(
        new Date("2023-01-21T01:00:00.123Z").getTime(),
        "1m",
      ),
    ).toBe("2023-01-21T00:59:00.000Z");
  });

  it("should return the correct date for 5m bar size with milliseconds", () => {
    expect(
      lastClosedCandleDate(
        new Date("2023-01-21T01:00:00.123Z").getTime(),
        "5m",
      ),
    ).toBe("2023-01-21T00:55:00.000Z");
  });

  it("should return the correct date for 15m bar size with milliseconds", () => {
    expect(
      lastClosedCandleDate(
        new Date("2023-01-21T01:00:00.123Z").getTime(),
        "15m",
      ),
    ).toBe("2023-01-21T00:45:00.000Z");
  });

  it("should return the correct date for 1h bar size with milliseconds", () => {
    expect(
      lastClosedCandleDate(
        new Date("2023-01-21T01:00:00.123Z").getTime(),
        "1h",
      ),
    ).toBe("2023-01-21T00:00:00.000Z");
  });
});
