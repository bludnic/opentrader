import { configureStore } from "@reduxjs/toolkit";
import { gridBotFormSlice, GridBotFormState } from "./bot-form";

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
