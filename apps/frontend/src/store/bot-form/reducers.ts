import type { IGridLine } from "@opentrader/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { GridBotFormChartBarSize } from "src/store/bot-form/types";
import type { TExchangeAccount } from "src/types/trpc";
import type { ExchangeCode } from "@opentrader/types";
import type {
  ChangeFormTypePayload,
  UpdateGridLinePricePayload,
  UpdateGridLineQuantityPayload,
} from "./actions";
import {
  addGridLineAction,
  changeFormTypeAction,
  changeGridLinesNumberAction,
  changeHighPriceAction,
  changeLowPriceAction,
  changeQuantityPerGridAction,
  changeBarSizeAction,
  removeGridLineAction,
  setExchangeAccountIdAction,
  setGridLinesAction,
  setHighPriceAction,
  setLowPriceAction,
  setQuantityPerGridAction,
  updateGridLinePriceAction,
  updateGridLineQuantityAction,
  updateGridLinesAction,
  setExchangeCodeAction,
  setSymbolIdAction,
  changeSymbolIdAction,
  setBotNameAction,
  changeBotNameAction,
} from "./actions";
import { initialState } from "./state";

export const gridBotFormSlice = createSlice({
  name: "gridBotForm",
  initialState,
  reducers: {
    [changeFormTypeAction.type]: (
      state,
      action: PayloadAction<ChangeFormTypePayload>,
    ) => {
      state.type = action.payload;
    },
    [setExchangeAccountIdAction.type]: (
      state,
      action: PayloadAction<TExchangeAccount["id"]>,
    ) => {
      state.exchangeAccountId = action.payload;
    },
    [setExchangeCodeAction.type]: (
      state,
      action: PayloadAction<ExchangeCode>,
    ) => {
      state.exchangeCode = action.payload;
    },
    [setSymbolIdAction.type]: (state, action: PayloadAction<string>) => {
      state.symbolId = action.payload;
    },
    [changeSymbolIdAction.type]: (state, action: PayloadAction<string>) => {
      state.symbolId = action.payload;
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
      action: PayloadAction<number>,
    ) => {
      state.gridLinesNumber = action.payload;
    },
    [changeQuantityPerGridAction.type]: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.quantityPerGrid = action.payload;
    },
    [setQuantityPerGridAction.type]: (state, action: PayloadAction<string>) => {
      state.quantityPerGrid = action.payload;
    },
    [setBotNameAction.type]: (state, action: PayloadAction<string>) => {
      state.botName = action.payload;
    },
    [changeBotNameAction.type]: (state, action: PayloadAction<string>) => {
      state.botName = action.payload;
    },
    [changeBarSizeAction.type]: (
      state,
      action: PayloadAction<GridBotFormChartBarSize>,
    ) => {
      state.barSize = action.payload;
    },
    [setGridLinesAction.type]: (state, action: PayloadAction<IGridLine[]>) => {
      state.gridLines = action.payload;
    },
    [updateGridLinesAction.type]: (
      state,
      action: PayloadAction<IGridLine[]>,
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
      action: PayloadAction<UpdateGridLinePricePayload>,
    ) => {
      const { gridLineIndex, price } = action.payload;

      state.gridLines[gridLineIndex].price = price;
    },
    [updateGridLineQuantityAction.type]: (
      state,
      action: PayloadAction<UpdateGridLineQuantityPayload>,
    ) => {
      const { gridLineIndex, quantity } = action.payload;

      state.gridLines[gridLineIndex].quantity = quantity;
    },
  },
});

export const {
  changeFormType,
  setExchangeAccountId,
  setExchangeCode,
  setSymbolId,
  changeSymbolId,
  setHighPrice,
  changeHighPrice,
  setLowPrice,
  changeLowPrice,
  changeGridLinesNumber,
  setQuantityPerGrid,
  changeQuantityPerGrid,
  setBotName,
  changeBotName,
  changeBarSize,
  setGridLines,
  updateGridLines,
  addGridLine,
  removeGridLine,
  updateGridLinePrice,
  updateGridLineQuantity,
} = gridBotFormSlice.actions;
