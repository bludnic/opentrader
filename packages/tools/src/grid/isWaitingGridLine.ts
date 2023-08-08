import big from 'big.js';
import { IGridLine } from '@bifrost/types';

export function isWaitingGridLine(
  gridLine: IGridLine,
  gridLines: IGridLine[],
  currentAssetPrice: number,
) {
  const gridLineIndex = gridLines.findIndex(
    (gridLineItem) =>
      gridLineItem.price === gridLine.price &&
      gridLineItem.quantity === gridLine.quantity,
  );

  if (gridLineIndex === -1)
    throw new Error(
      `Cannot find grid line index of { price: ${gridLine.price}, quantity: ${gridLine.quantity} }`,
    );

  const targetGridLine = gridLines[gridLineIndex];
  const prevGridLine: IGridLine | undefined = gridLines[gridLineIndex - 1];
  const nextGridLine: IGridLine | undefined = gridLines[gridLineIndex + 1];

  const targetGridLinePriceDiff = big(currentAssetPrice)
    .minus(targetGridLine.price)
    .abs();

  if (prevGridLine) {
    const prevGridLinePriceDiff = big(currentAssetPrice)
      .minus(prevGridLine.price)
      .abs();

    // prevGridLinePriceDiff < targetGridLinePriceDiff
    if (big(prevGridLinePriceDiff).lt(targetGridLinePriceDiff)) {
      return false;
    }
  }

  if (nextGridLine) {
    const nextGridLinePriceDiff = big(currentAssetPrice)
      .minus(nextGridLine.price)
      .abs();

    // nextGridLinePriceDiff < targetGridLinePriceDiff
    if (big(nextGridLinePriceDiff).lte(targetGridLinePriceDiff)) {
      return false;
    }
  }

  return true;
}
