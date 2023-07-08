import { IGridLine } from "./types/grid-line.interface";

export function nextGridLinePrice(
  gridLines: IGridLine[],
  currentGridLineIndex: number,
): number {
  const nextGridLine = gridLines[currentGridLineIndex + 1];

  if (!nextGridLine) {
    throw new Error(
      `nextGridLinePrice: Grid line at index ${currentGridLineIndex} doesn't exists`,
    );
  }

  return nextGridLine.price;
}
