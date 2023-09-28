import { createAction } from "@reduxjs/toolkit";
import { TGridBot, TGridBotCreateInput } from "src/types/trpc";

const CREATE_GRID_BOT = "createGridBot";
export const createGridBotAction = createAction<
  TGridBotCreateInput,
  typeof CREATE_GRID_BOT
>(CREATE_GRID_BOT);

export const createGridBotSucceededAction = createAction<
  TGridBot,
  "createGridBotSucceeded"
>("createGridBotSucceeded");

export const createGridBotFailedAction = createAction<
  Error,
  "createGridBotFailed"
>("createGridBotFailed");
