import big from 'big.js';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IGridBotLevel } from 'src/grid-bot/types/grid-bot-level.interface';
import { calculateGridStepSize } from './calculateGridStepSize';

export function calculateGridLevels(bot: IGridBot): IGridBotLevel[] {
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
