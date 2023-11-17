import { IGridLine, ISymbolInfo } from "@opentrader/types";
import { filterPrice, filterQuantity } from "../currency";
import { calculateInvestment } from "./calculateInvestment";
import { computeGridLevelsFromCurrentAssetPrice } from "./computeGridLevelsFromCurrentAssetPrice";

export function computeInvestmentAmount(
  symbol: ISymbolInfo,
  gridLines: IGridLine[],
  currentAssetPrice: number,
) {
  const gridLevels = computeGridLevelsFromCurrentAssetPrice(
    gridLines,
    currentAssetPrice,
  );

  const { baseCurrencyAmount, quoteCurrencyAmount } =
    calculateInvestment(gridLevels);

  const totalInQuoteCurrency =
    quoteCurrencyAmount + baseCurrencyAmount * currentAssetPrice; // assume that the user bought base currency at a market price

  return {
    baseCurrencyAmount: filterQuantity(baseCurrencyAmount, symbol.filters),
    quoteCurrencyAmount: filterPrice(quoteCurrencyAmount, symbol.filters),
    totalInQuoteCurrency: filterPrice(totalInQuoteCurrency, symbol.filters),
  };
}
