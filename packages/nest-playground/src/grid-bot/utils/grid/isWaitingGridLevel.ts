import big from 'big.js';

import { IGridBotLevel } from 'src/grid-bot/types/grid-bot-level.interface';

export function isWaitingGridLevel(
  gridLevel: IGridBotLevel,
  gridStepSize: number,
  currentAssetPrice: number,
) {
  const halfGridStepSize = big(gridStepSize).div(2).toNumber();

  const waitingPriceRangeTop = big(gridLevel.price)
    .plus(halfGridStepSize)
    .toNumber();
  const waitingPriceRangeBottom = big(gridLevel.price)
    .minus(halfGridStepSize)
    .toNumber();

  // currentAssetPrice > waitingPriceRangeBottom &&
  // currentAssetPrice <= waitingPriceRangeTop
  return (
    big(currentAssetPrice).gt(waitingPriceRangeBottom) &&
    big(currentAssetPrice).lte(waitingPriceRangeTop)
  );
}
