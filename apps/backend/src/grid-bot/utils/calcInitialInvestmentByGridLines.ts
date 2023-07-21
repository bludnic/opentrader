import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { InitialInvestment } from 'src/core/db/types/entities/grid-bots/investment/initial-investment.interface';
import { calculateInvestment } from '@bifrost/tools';
import { computeGridFromCurrentAssetPrice } from '@bifrost/tools';

export function calcInitialInvestmentByGridLines(
  gridLines: IGridLine[],
  currentAssetPrice: number,
): InitialInvestment {
  const initialDeals = computeGridFromCurrentAssetPrice(
    gridLines,
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
