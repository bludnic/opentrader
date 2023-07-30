import { IGridLine } from "@bifrost/types";
import { createAction } from "@reduxjs/toolkit";
import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { GridBotFormType } from "./types";

const CHANGE_FORM_TYPE = "changeFormType";
export type ChangeFormTypePayload = GridBotFormType;

export const changeFormTypeAction = createAction<
  ChangeFormTypePayload,
  typeof CHANGE_FORM_TYPE
>(CHANGE_FORM_TYPE);

const SET_EXCHANGE_ACCOUNT_ID = "setExchangeAccountId";
export const setExchangeAccountIdAction = createAction<
  ExchangeAccountDto["id"],
  typeof SET_EXCHANGE_ACCOUNT_ID
>(SET_EXCHANGE_ACCOUNT_ID);

const SET_CURRENCY_PAIR = "setCurrencyPair";
export const setCurrencyPairAction = createAction<
  string,
  typeof SET_CURRENCY_PAIR
>(SET_CURRENCY_PAIR);

const CHANGE_CURRENCY_PAIR = "changeCurrencyPair";
export const changeCurrencyPairAction = createAction<
  string,
  typeof CHANGE_CURRENCY_PAIR
>(CHANGE_CURRENCY_PAIR);

const SET_HIGH_PRICE = "setHighPrice";
export const setHighPriceAction = createAction<number, typeof SET_HIGH_PRICE>(
  SET_HIGH_PRICE
);

const CHANGE_HIGH_PRICE = "changeHighPrice";
export const changeHighPriceAction = createAction<
  number,
  typeof CHANGE_HIGH_PRICE
>(CHANGE_HIGH_PRICE);

const SET_LOW_PRICE = "setLowPrice";
export const setLowPriceAction = createAction<number, typeof SET_LOW_PRICE>(
  SET_LOW_PRICE
);

const CHANGE_LOW_PRICE = "changeLowPrice";
export const changeLowPriceAction = createAction<
  number,
  typeof CHANGE_LOW_PRICE
>(CHANGE_LOW_PRICE);

const CHANGE_GRID_LINES_NUMBER = "changeGridLinesNumber";
export const changeGridLinesNumberAction = createAction<
  number,
  typeof CHANGE_GRID_LINES_NUMBER
>(CHANGE_GRID_LINES_NUMBER);

const SET_QUANTITY_PER_GRID = "setQuantityPerGrid";
export const setQuantityPerGridAction = createAction<
  string,
  typeof SET_QUANTITY_PER_GRID
  >(SET_QUANTITY_PER_GRID);

const CHANGE_QUANTITY_PER_GRID = "changeQuantityPerGrid";
export const changeQuantityPerGridAction = createAction<
  string,
  typeof CHANGE_QUANTITY_PER_GRID
>(CHANGE_QUANTITY_PER_GRID);

const SET_GRID_LINES = "setGridLines";
export const setGridLinesAction = createAction<
  IGridLine[],
  typeof SET_GRID_LINES
>(SET_GRID_LINES);

const UPDATE_GRID_LINES = "updateGridLines";
export const updateGridLinesAction = createAction<
  IGridLine[],
  typeof UPDATE_GRID_LINES
>(UPDATE_GRID_LINES);

const ADD_GRID_LINE = "addGridLine";
export const addGridLineAction = createAction<IGridLine, typeof ADD_GRID_LINE>(
  ADD_GRID_LINE
);

const REMOVE_GRID_LINE = "removeGridLine";
export const removeGridLineAction = createAction<
  number,
  typeof REMOVE_GRID_LINE
>(REMOVE_GRID_LINE);

const UPDATE_GRID_LINE_PRICE = "updateGridLinePrice";
export type UpdateGridLinePricePayload = {
  gridLineIndex: number;
  price: number;
};
export const updateGridLinePriceAction = createAction<
  UpdateGridLinePricePayload,
  typeof UPDATE_GRID_LINE_PRICE
>(UPDATE_GRID_LINE_PRICE);

const UPDATE_GRID_LINE_QUANTITY = "updateGridLineQuantity";
export type UpdateGridLineQuantityPayload = {
  gridLineIndex: number;
  quantity: number;
};
export const updateGridLineQuantityAction = createAction<
  UpdateGridLineQuantityPayload,
  typeof UPDATE_GRID_LINE_QUANTITY
>(UPDATE_GRID_LINE_QUANTITY);
