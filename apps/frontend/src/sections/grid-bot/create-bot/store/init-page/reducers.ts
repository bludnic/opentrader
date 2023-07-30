import { createSlice } from "@reduxjs/toolkit";
import {
  initPageAction,
  markPageAsReadyAction,
} from "./actions";
import { initialState } from "./state";

export const gridBotInitPageSlice = createSlice({
  name: "gridBotInitPage",
  initialState,
  reducers: {
    [markPageAsReadyAction.type]: (state) => {
      state.isReady = true;
    },
    [initPageAction.type]: (state) => {},
  },
});

export const { initPage, markPageAsReady } = gridBotInitPageSlice.actions;
