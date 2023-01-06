import { GridLineDto } from "src/lib/bifrost/client";

export function findHighestGridLinePrice(gridLines: GridLineDto[]): number {
  const priceArray = gridLines.map((gridLine) => gridLine.price);

  return Math.max(...priceArray);
}
