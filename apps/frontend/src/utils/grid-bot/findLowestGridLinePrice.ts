import { GridLineDto } from "src/lib/bifrost/client";

export function findLowestGridLinePrice(gridLines: GridLineDto[]): number {
  const priceArray = gridLines.map((gridLine) => gridLine.price);

  return Math.min(...priceArray);
}
