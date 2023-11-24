import type { IGridLine } from "@opentrader/types";

export function findLowestGridLinePrice(gridLines: IGridLine[]): number {
  const priceArray = gridLines.map((gridLine) => gridLine.price);

  return Math.min(...priceArray);
}
