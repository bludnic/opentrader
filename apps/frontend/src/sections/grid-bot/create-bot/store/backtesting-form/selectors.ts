import { Selector } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { BacktestingFormState } from "./state";

export const selectStartDate: Selector<
  RootState,
  BacktestingFormState["startDate"]
> = (rootState) => {
  return rootState.backtestingForm.startDate;
};

export const selectEndDate: Selector<
  RootState,
  BacktestingFormState["endDate"]
> = (rootState) => {
  return rootState.backtestingForm.endDate;
};
