import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateBotRequestBodyDto, GridBotDto } from "src/lib/bifrost/client";
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
      payload: PayloadAction<CreateBotRequestBodyDto>
    ) => {
      state.status = FetchStatus.Loading;
      state.err = null;
    },
    [createGridBotSucceededAction.type]: (
      state,
      action: PayloadAction<GridBotDto>
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
