import {
  calculateInvestment,
  computeGridFromCurrentAssetPrice,
  decomposeSymbolId,
  filterPrice,
  filterQuantity,
} from "@opentrader/tools";
import { BarSize, ExchangeCode, IGridLine } from "@opentrader/types";
import { Selector } from "@reduxjs/toolkit";
import { trpcApi } from "src/lib/trpc/endpoints";
import { GridBotFormState } from "./state";
import { RootState } from "src/store";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { TExchangeAccount } from "src/types/trpc";
import { GridBotFormType } from "./types";

export const selectBotFormState: Selector<RootState, GridBotFormState> = (
  rootState,
) => rootState.gridBotForm;

export const selectFormType: Selector<RootState, GridBotFormType> = (
  rootState,
) => rootState.gridBotForm.type;

export const selectExchangeAccountId: Selector<
  RootState,
  TExchangeAccount["id"]
> = (rootState) => rootState.gridBotForm.exchangeAccountId;

export const selectExchangeCode: Selector<RootState, ExchangeCode> = (
  rootState,
) => rootState.gridBotForm.exchangeCode as ExchangeCode;

export const selectCurrencyPair: Selector<RootState, string> = (rootState) => {
  const { currencyPairSymbol } = decomposeSymbolId(
    rootState.gridBotForm.symbolId,
  );

  return currencyPairSymbol;
};

export const selectSymbolId: Selector<RootState, string> = (rootState) =>
  rootState.gridBotForm.symbolId;

export const selectHighPrice: Selector<RootState, number> = (rootState) =>
  rootState.gridBotForm.highPrice;

export const selectLowPrice: Selector<RootState, number> = (rootState) =>
  rootState.gridBotForm.lowPrice;

export const selectGridLinesNumber: Selector<RootState, number> = (rootState) =>
  rootState.gridBotForm.gridLinesNumber;

export const selectQuantityPerGrid: Selector<RootState, string> = (rootState) =>
  rootState.gridBotForm.quantityPerGrid;

export const selectBotName: Selector<RootState, string> = (rootState) =>
  rootState.gridBotForm.botName;

export const computeInvestmentAmount: Selector<
  RootState,
  {
    baseCurrencyAmount: string;
    quoteCurrencyAmount: string;
    totalInQuoteCurrency: string;
  }
> = (rootState) => {
  const symbolId = selectSymbolId(rootState);
  const currentAssetPriceState = trpcApi.symbol.price.select({
    symbolId,
  });

  const symbol = selectSymbolById(symbolId);

  const statsIsReady = !!symbol && currentAssetPriceState;

  if (!statsIsReady) {
    // @todo review this approach
    return {
      baseCurrencyAmount: "0",
      quoteCurrencyAmount: "0",
      totalInQuoteCurrency: "0",
    };
  }

  const { price: currentAssetPrice } = currentAssetPriceState;

  const gridLines = selectGridLines(rootState);

  const gridLevels = computeGridFromCurrentAssetPrice(
    gridLines,
    currentAssetPrice,
  );

  const { baseCurrencyAmount, quoteCurrencyAmount } =
    calculateInvestment(gridLevels);

  // @todo make a helper in @opentrader/tools
  const totalInQuoteCurrency =
    quoteCurrencyAmount + baseCurrencyAmount * currentAssetPrice; // I assume that the user bought base currency for placing sell orders at a market price

  return {
    baseCurrencyAmount: filterQuantity(baseCurrencyAmount, symbol.filters),
    quoteCurrencyAmount: filterPrice(quoteCurrencyAmount, symbol.filters),
    totalInQuoteCurrency: filterPrice(totalInQuoteCurrency, symbol.filters),
  };
};

export const selectGridLines: Selector<RootState, IGridLine[]> = (rootState) =>
  rootState.gridBotForm.gridLines;

export const selectGridLine = (
  gridLineIndex: number,
): Selector<RootState, IGridLine> => {
  return (rootState: RootState) =>
    rootState.gridBotForm.gridLines[gridLineIndex];
};

export const selectBarSize: Selector<RootState, BarSize> = (rootState) => {
  return rootState.gridBotForm.barSize;
};
