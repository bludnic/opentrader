import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { call, put } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import {
  CreateBotRequestBodyDto,
  CreateBotResponseBodyDto,
} from "src/lib/bifrost/client";
import {
  createGridBotSucceeded,
  createGridBotFailed,
} from "./reducers";

export function* createGridBotWorker(action: PayloadAction<CreateBotRequestBodyDto>) {
  try {
    const { data }: AxiosResponse<CreateBotResponseBodyDto> = yield call(
      bifrostApi.createGridBot,
      action.payload
    );

    yield put(createGridBotSucceeded(data.bot));
  } catch (err) {
    yield put(createGridBotFailed(err as Error));
  }
}
