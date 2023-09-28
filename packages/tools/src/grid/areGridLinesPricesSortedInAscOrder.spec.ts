import { areGridLinesPricesSortedInAscOrder } from "src/grid/areGridLinesPricesSortedInAscOrder";

describe("areGridLinesPricesSortedInAscOrder", () => {
  it("should return `true` when array is empty", () => {
    expect(areGridLinesPricesSortedInAscOrder([])).toBe(true);
  });

  it("should return `true` when only one grid line is preset", () => {
    expect(
      areGridLinesPricesSortedInAscOrder([{ price: 10, quantity: 1 }])
    ).toBe(true);
  });

  it("should return `false` when grid lines are not sorted", () => {
    expect(
      areGridLinesPricesSortedInAscOrder([
        { price: 1, quantity: 1 },
        { price: 3, quantity: 1 },
        { price: 2, quantity: 1 },
      ])
    ).toBe(false);
  });

  it("should return `true` when grid lines are sorted", () => {
    expect(
      areGridLinesPricesSortedInAscOrder([
        { price: 1, quantity: 1 },
        { price: 2, quantity: 1 },
        { price: 3, quantity: 1 },
      ])
    ).toBe(true);
  });

  it("should return `true` when some grid lines have equal prices", () => {
    expect(
      areGridLinesPricesSortedInAscOrder([
        { price: 1, quantity: 1 },
        { price: 2, quantity: 1 },
        { price: 2, quantity: 1 },
        { price: 3, quantity: 1 },
      ])
    ).toBe(true);
  });
});
