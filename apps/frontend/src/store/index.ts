import { configureStore } from "@reduxjs/toolkit";
import type { GridBotFormState } from "./bot-form";
import { gridBotFormSlice } from "./bot-form";

export type RootState = {
  gridBotForm: GridBotFormState;
};

export const store = configureStore({
  reducer: {
    gridBotForm: gridBotFormSlice.reducer,
  },
  devTools: true,
});

export type AppDispatch = (typeof store)["dispatch"];
