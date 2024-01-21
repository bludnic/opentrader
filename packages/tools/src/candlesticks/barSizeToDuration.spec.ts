import { barSizeToDuration } from "./barSizeToDuration";

describe("barSizeToDuration function", () => {
  it("should return the correct duration for each bar size", () => {
    expect(barSizeToDuration("1m")).toBe(60 * 1000);
    expect(barSizeToDuration("5m")).toBe(5 * 60 * 1000);
    expect(barSizeToDuration("15m")).toBe(15 * 60 * 1000);
    expect(barSizeToDuration("1h")).toBe(60 * 60 * 1000);
    expect(barSizeToDuration("4h")).toBe(4 * 60 * 60 * 1000);
    expect(barSizeToDuration("1d")).toBe(24 * 60 * 60 * 1000);
    expect(barSizeToDuration("1w")).toBe(7 * 24 * 60 * 60 * 1000);
    expect(barSizeToDuration("1M")).toBe(30 * 24 * 60 * 60 * 1000); // Assuming 30 days for a month
    expect(barSizeToDuration("3M")).toBe(90 * 24 * 60 * 60 * 1000); // Assuming 90 days for three months
  });
});
