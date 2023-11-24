import big from "big.js";
import type { IGridLine } from "@opentrader/types";

/**
 * Calculates average quantityPerGrid in Base Currency
 * @param gridLines - Grid lines
 */
export function calcAverageQuantityPerGrid(gridLines: IGridLine[]): number {
  const quantitySum = gridLines.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  return big(quantitySum)
    .div(gridLines.length - 1)
    .toNumber();
}
