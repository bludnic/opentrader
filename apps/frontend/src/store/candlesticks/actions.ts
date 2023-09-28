import { createAction } from "@reduxjs/toolkit";
import { CandlestickEntity } from "src/lib/bifrost/client";

export type RequestCandlesticksActionPayload = {
  symbolId: string;
};

const REQUEST_CANDLESTICKS_ACTION = "requestCandlesticks";
export const requestCandlesticksAction = createAction<
  RequestCandlesticksActionPayload,
  typeof REQUEST_CANDLESTICKS_ACTION
>(REQUEST_CANDLESTICKS_ACTION);

export type FetchCandlesticksActionPayload = {
  symbolId: string;
};

const FETCH_CANDLESTICKS = "fetchCandlesticks";
export const fetchCandlesticksAction = createAction<
  FetchCandlesticksActionPayload,
  typeof FETCH_CANDLESTICKS
>(FETCH_CANDLESTICKS);

export const fetchCandlesticksSucceededAction = createAction<
  CandlestickEntity[],
  "fetchCandlesticksSucceeded"
>("fetchCandlesticksSucceeded");

export const fetchCandlesticksFailedAction = createAction<
  Error,
  "fetchCandlesticksFailed"
>("fetchCandlesticksFailed");
