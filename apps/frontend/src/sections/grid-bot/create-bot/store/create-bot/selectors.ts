import { Selector } from "@reduxjs/toolkit";
import { CreateGridBotState } from "./state";
import { RootState } from "src/store";

export const selectCreateGridBotState: Selector<
  RootState,
  CreateGridBotState
> = (rootState) => rootState.createGridBot;
