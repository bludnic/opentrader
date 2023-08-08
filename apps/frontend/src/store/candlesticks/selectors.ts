import { Selector } from "@reduxjs/toolkit";
import { CandlesticksState } from "src/store/candlesticks/state";
import { RootState } from "src/store/index";
import { CandlestickEntity } from "src/lib/bifrost/client";

export const selectCandlesticksState: Selector<RootState, CandlesticksState> = (
  rootState
) => rootState.candlesticks;

export const selectCandlesticks: Selector<RootState, CandlestickEntity[]> = (
  rootState
) => rootState.candlesticks.candlesticks;
