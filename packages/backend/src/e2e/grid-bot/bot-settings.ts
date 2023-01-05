import { IGridBotSettings } from 'src/e2e/grid-bot/types';
import { calcGridLines } from 'src/grid-bot/utils/grid/calcGridLines';

export const gridBotQuantityPerGrid = 5;

export const gridBotSettings: IGridBotSettings = {
  id: 'E2DDOTBUSD_NEW',
  name: '[DOT/BUSD] E2E Testing',
  baseCurrency: 'DOT',
  quoteCurrency: 'BUSD',
  gridLines: calcGridLines(20, 10, 11, gridBotQuantityPerGrid),
};
