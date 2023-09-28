import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BacktestingFormState, initialState } from "./state";

export const backtestingFormSlice = createSlice({
  name: "backtestingForm",
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    changeStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
    changeEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setStartDate, changeStartDate, setEndDate, changeEndDate } =
  backtestingFormSlice.actions;
