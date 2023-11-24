import type { IGridLine } from "@opentrader/types";

export function nextGridLinePrice(
  gridLines: IGridLine[],
  currentGridLineIndex: number,
): number {
  const nextGridLine = gridLines[currentGridLineIndex + 1];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- for readability
  if (!nextGridLine) {
    throw new Error(
      `nextGridLinePrice: Grid line at index ${currentGridLineIndex} doesn't exists`,
    );
  }

  return nextGridLine.price;
}
