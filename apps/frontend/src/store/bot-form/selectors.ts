import { decomposeSymbolId } from "@opentrader/tools";
import type { BarSize, ExchangeCode, IGridLine } from "@opentrader/types";
import type { Selector } from "@reduxjs/toolkit";
import type { RootState } from "src/store";
import type { TExchangeAccount } from "src/types/trpc";
import type { GridBotFormState } from "./state";
import type { GridBotFormType } from "./types";

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
