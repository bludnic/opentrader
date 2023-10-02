import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TGridBot, TGridBotCreateInput } from "src/types/trpc";
import { FetchStatus } from "src/utils/redux/types";
import {
  createGridBotAction,
  createGridBotSucceededAction,
  createGridBotFailedAction,
} from "./actions";
import { initialState } from "./state";

export const createGridBotSlice = createSlice({
  name: "createGridBot",
  initialState,
  reducers: {
    [createGridBotAction.type]: (
      state,
      payload: PayloadAction<TGridBotCreateInput>,
    ) => {
      state.status = FetchStatus.Loading;
      state.err = null;
    },
    [createGridBotSucceededAction.type]: (
      state,
      action: PayloadAction<TGridBot>,
    ) => {
      state.status = FetchStatus.Succeeded;
      state.bot = action.payload;
    },
    [createGridBotFailedAction.type]: (state, action: PayloadAction<Error>) => {
      state.status = FetchStatus.Error;
      state.err = action.payload;
    },
  },
});

export const { createGridBot, createGridBotSucceeded, createGridBotFailed } =
  createGridBotSlice.actions;
