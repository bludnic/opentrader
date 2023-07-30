import { IGridLine } from "@bifrost/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExchangeAccountDto } from "src/lib/bifrost/client";
import {
  addGridLineAction,
  changeCurrencyPairAction,
  changeFormTypeAction,
  ChangeFormTypePayload,
  changeGridLinesNumberAction,
  changeHighPriceAction,
  changeLowPriceAction,
  changeQuantityPerGridAction,
  removeGridLineAction,
  setCurrencyPairAction,
  setExchangeAccountIdAction,
  setGridLinesAction,
  setHighPriceAction,
  setLowPriceAction,
  setQuantityPerGridAction,
  updateGridLinePriceAction,
  UpdateGridLinePricePayload,
  updateGridLineQuantityAction,
  UpdateGridLineQuantityPayload,
  updateGridLinesAction,
} from "./actions";
import { initialState } from "./state";

export const gridBotFormSlice = createSlice({
  name: "gridBotForm",
  initialState,
  reducers: {
    [changeFormTypeAction.type]: (
      state,
      action: PayloadAction<ChangeFormTypePayload>
    ) => {
      state.type = action.payload;
    },
    [setExchangeAccountIdAction.type]: (
      state,
      action: PayloadAction<ExchangeAccountDto["id"]>
    ) => {
      state.exchangeAccountId = action.payload;
    },
    [setCurrencyPairAction.type]: (state, action: PayloadAction<string>) => {
      state.currencyPair = action.payload;
    },
    [changeCurrencyPairAction.type]: (state, action: PayloadAction<string>) => {
      state.currencyPair = action.payload;
    },
    [changeHighPriceAction.type]: (state, action: PayloadAction<number>) => {
      state.highPrice = action.payload;
    },
    [setHighPriceAction.type]: (state, action: PayloadAction<number>) => {
      state.highPrice = action.payload;
    },
    [changeLowPriceAction.type]: (state, action: PayloadAction<number>) => {
      state.lowPrice = action.payload;
    },
    [setLowPriceAction.type]: (state, action: PayloadAction<number>) => {
      state.lowPrice = action.payload;
    },
    [changeGridLinesNumberAction.type]: (
      state,
      action: PayloadAction<number>
    ) => {
      state.gridLinesNumber = action.payload;
    },
    [changeQuantityPerGridAction.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.quantityPerGrid = action.payload;
    },
    [setQuantityPerGridAction.type]: (state, action: PayloadAction<string>) => {
      state.quantityPerGrid = action.payload;
    },
    [setGridLinesAction.type]: (state, action: PayloadAction<IGridLine[]>) => {
      state.gridLines = action.payload;
    },
    [updateGridLinesAction.type]: (
      state,
      action: PayloadAction<IGridLine[]>
    ) => {
      state.gridLines = action.payload;
    },
    [addGridLineAction.type]: (state, action: PayloadAction<IGridLine>) => {
      state.gridLines.push(action.payload);
    },
    [removeGridLineAction.type]: (state, action: PayloadAction<number>) => {
      const gridLineIndex = action.payload;

      state.gridLines.splice(gridLineIndex, 1);
    },
    [updateGridLinePriceAction.type]: (
      state,
      action: PayloadAction<UpdateGridLinePricePayload>
    ) => {
      const { gridLineIndex, price } = action.payload;

      state.gridLines[gridLineIndex].price = price;
    },
    [updateGridLineQuantityAction.type]: (
      state,
      action: PayloadAction<UpdateGridLineQuantityPayload>
    ) => {
      const { gridLineIndex, quantity } = action.payload;

      state.gridLines[gridLineIndex].quantity = quantity;
    },
  },
});

export const {
  changeFormType,
  setExchangeAccountId,
  setCurrencyPair,
  changeCurrencyPair,
  setHighPrice,
  changeHighPrice,
  setLowPrice,
  changeLowPrice,
  changeGridLinesNumber,
  setQuantityPerGrid,
  changeQuantityPerGrid,
  setGridLines,
  updateGridLines,
  addGridLine,
  removeGridLine,
  updateGridLinePrice,
  updateGridLineQuantity,
} = gridBotFormSlice.actions;
