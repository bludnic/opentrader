import { createAction } from "@reduxjs/toolkit";
import { SymbolInfoDto } from "src/lib/bifrost/client";

export const fetchSymbolsAction = createAction("fetchSymbols");

export const fetchSymbolsSucceededAction = createAction<
  SymbolInfoDto[],
  "fetchSymbolsSucceeded"
>("fetchSymbolsSucceeded");

export const fetchSymbolsFailedAction = createAction<
  Error,
  "fetchSymbolsFailed"
>("fetchSymbolsFailed");
