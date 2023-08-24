import {
  calculateInvestment,
  computeGridFromCurrentAssetPrice, decomposeSymbolId,
  filterPrice,
  filterQuantity
} from "@bifrost/tools";
import { BarSize, ExchangeCode, IGridLine } from "@bifrost/types";
import { Selector } from "@reduxjs/toolkit";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { GridBotFormState } from "src/sections/grid-bot/create-bot/store/bot-form/state";
import { RootState } from "src/store";
import { rtkApi } from "src/lib/bifrost/rtkApi";
import { useAppSelector } from "src/store/hooks";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { GridBotFormType } from "./types";

export const selectBotFormState: Selector<RootState, GridBotFormState> = (
  rootState
) => rootState.gridBotForm;

export const selectFormType: Selector<RootState, GridBotFormType> = (
  rootState
) => rootState.gridBotForm.type;

export const selectExchangeAccountId: Selector<
  RootState,
  ExchangeAccountDto["id"]
> = (rootState) => rootState.gridBotForm.exchangeAccountId;

export const selectExchangeCode: Selector<RootState, ExchangeCode> = (rootState) =>
  rootState.gridBotForm.exchangeCode as ExchangeCode;

export const selectCurrencyPair: Selector<RootState, string> = (rootState) => {
  const { currencyPairSymbol } = decomposeSymbolId(rootState.gridBotForm.symbolId);

  return currencyPairSymbol;
}

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

export const computeInvestmentAmount: Selector<
  RootState,
  {
    baseCurrencyAmount: string;
    quoteCurrencyAmount: string;
    totalInQuoteCurrency: string;
  }
> = (rootState) => {
  const symbolId = selectSymbolId(rootState);
  const currentAssetPriceState =
    rtkApi.endpoints.getSymbolCurrentPrice.select(symbolId)(rootState);
  const symbol = selectSymbolById(symbolId)(rootState);

  const statsIsReady =
    !!symbol && currentAssetPriceState.status === QueryStatus.fulfilled;

  if (!statsIsReady) {
    // @todo review this approach
    return {
      baseCurrencyAmount: "0",
      quoteCurrencyAmount: "0",
      totalInQuoteCurrency: "0",
    };
  }

  const {
    data: { price: currentAssetPrice },
  } = currentAssetPriceState;

  const gridLines = selectGridLines(rootState);

  const gridLevels = computeGridFromCurrentAssetPrice(
    gridLines,
    currentAssetPrice
  );

  const { baseCurrencyAmount, quoteCurrencyAmount } =
    calculateInvestment(gridLevels);

  // @todo make a helper in @bifrost/tools
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
  gridLineIndex: number
): Selector<RootState, IGridLine> => {
  return (rootState: RootState) =>
    rootState.gridBotForm.gridLines[gridLineIndex];
};

export const selectBarSize: Selector<RootState, BarSize> = (rootState) => {
  return rootState.gridBotForm.barSize;
};
