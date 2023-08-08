import big from "big.js";
import { GridLineDto } from "src/lib/bifrost/client";

/**
 * Calculates average quantityPerGrid in Base Currency
 * @param gridLines
 */
export function calcAverageQuantityPerGrid(gridLines: GridLineDto[]): number {
  const quantitySum = gridLines.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  return big(quantitySum)
    .div(gridLines.length - 1)
    .toNumber();
}
