import big from "big.js";

// Note: Use this function only for tests purposes to avoid boilerplate
export function calcGridStepSize(
  highPrice: number,
  lowPrice: number,
  gridLevels: number,
): number {
  return big(highPrice)
    .minus(lowPrice)
    .div(gridLevels - 1)
    .toNumber();
}
