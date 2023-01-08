import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { InitialInvestment } from 'src/core/db/types/entities/grid-bots/investment/initial-investment.interface';
import { calculateInvestment } from 'src/grid-bot/utils/calculateInvestment';
import { calcInitialDealsByGridLines } from 'src/grid-bot/utils/deals/calcInitialDealsByGridLines';

export function calcInitialInvestmentByGridLines(
  gridLines: IGridLine[],
  baseCurrency: string,
  quoteCurrency: string,
  currentAssetPrice: number,
): InitialInvestment {
  const initialDeals = calcInitialDealsByGridLines(
    gridLines,
    baseCurrency,
    quoteCurrency,
    currentAssetPrice,
  );
  const investment = calculateInvestment(initialDeals);

  return {
    baseCurrency: {
      price: currentAssetPrice,
      quantity: investment.baseCurrencyAmount,
    },
    quoteCurrency: {
      quantity: investment.quoteCurrencyAmount,
    },
  };
}
