import { createAction } from "@reduxjs/toolkit";
import {
  CreateBotRequestBodyDto,
  GridBotDto,
} from "src/lib/bifrost/client";

const CREATE_GRID_BOT = "createGridBot";
export const createGridBotAction = createAction<
  CreateBotRequestBodyDto,
  typeof CREATE_GRID_BOT
>(CREATE_GRID_BOT);

export const createGridBotSucceededAction = createAction<
  GridBotDto,
  "createGridBotSucceeded"
>("createGridBotSucceeded");

export const createGridBotFailedAction = createAction<
  Error,
  "createGridBotFailed"
>("createGridBotFailed");
