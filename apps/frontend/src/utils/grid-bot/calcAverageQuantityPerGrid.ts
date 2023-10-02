import big from "big.js";
import { IGridLine } from "@opentrader/types";

/**
 * Calculates average quantityPerGrid in Base Currency
 * @param gridLines
 */
export function calcAverageQuantityPerGrid(gridLines: IGridLine[]): number {
  const quantitySum = gridLines.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  return big(quantitySum)
    .div(gridLines.length - 1)
    .toNumber();
}
