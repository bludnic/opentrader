import big from 'big.js';
import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';
import { IGridBotLevel } from 'src/grid-bot/types/grid-bot-level.interface';
import { calculateGridStepSize } from './calculateGridStepSize';

export function calculateGridLevels(bot: IBotFirestore): IGridBotLevel[] {
  const { highPrice, lowPrice, gridLevels } = bot;

  const gridStepSize: number = calculateGridStepSize(
    highPrice,
    lowPrice,
    gridLevels,
  );

  return Array.from({ length: gridLevels }).map((_, i) => ({
    price: big(lowPrice).plus(big(gridStepSize).mul(i)).toNumber(),
  }));
}
