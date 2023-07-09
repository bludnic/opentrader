import { IGridBotSettings } from 'src/e2e/grid-bot/types';
import { calcInitialInvestmentByGridLines } from 'src/grid-bot/utils/calcInitialInvestmentByGridLines';
import { calcGridLines } from '@bifrost/tools';

export const gridBotQuantityPerGrid = 5;

const baseCurrency = 'DOT';
const quoteCurrency = 'BUSD';
const gridLines = calcGridLines(20, 10, 11, gridBotQuantityPerGrid);

export const gridBotInitialInvestment = calcInitialInvestmentByGridLines(
  gridLines,
  baseCurrency,
  quoteCurrency,
  1, // doesn't matter
);

export const gridBotSettings: IGridBotSettings = {
  id: 'E2DDOTBUSD_NEW',
  name: '[DOT/BUSD] E2E Testing',
  baseCurrency,
  quoteCurrency,
  gridLines: calcGridLines(20, 10, 11, gridBotQuantityPerGrid),
};
