import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';

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
