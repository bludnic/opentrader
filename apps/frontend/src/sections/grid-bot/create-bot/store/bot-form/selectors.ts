import {
  calculateInvestment,
  computeGridFromCurrentAssetPrice,
} from "@bifrost/tools";
import { IGridLine } from "@bifrost/types";
import { Selector } from "@reduxjs/toolkit";
import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { GridBotFormState } from "src/sections/grid-bot/create-bot/store/bot-form/state";
import { RootState } from "src/store";
import { selectCurrentAssetPrice } from "src/store/current-asset-price/selectors";
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

export const selectCurrencyPair: Selector<RootState, string> = (rootState) =>
  rootState.gridBotForm.currencyPair;

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
    baseCurrencyAmount: number;
    quoteCurrencyAmount: number;
    totalInQuoteCurrency: number;
  }
> = (rootState) => {
  const currentAssetPrice = selectCurrentAssetPrice(rootState);
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
    baseCurrencyAmount,
    quoteCurrencyAmount,
    totalInQuoteCurrency,
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
