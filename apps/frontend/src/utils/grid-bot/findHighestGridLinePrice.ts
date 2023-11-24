import type { IGridLine } from "@opentrader/types";

export function findHighestGridLinePrice(gridLines: IGridLine[]): number {
  const priceArray = gridLines.map((gridLine) => gridLine.price);

  return Math.max(...priceArray);
}
