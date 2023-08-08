import { Selector } from "@reduxjs/toolkit";
import { RootState } from "src/store";

export const isPageReadySelector: Selector<RootState, boolean> = (rootState) =>
  rootState.gridBotInitPage.isReady;
