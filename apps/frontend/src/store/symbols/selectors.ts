import { Selector } from "@reduxjs/toolkit";
import { RootState } from "src/store/index";
import { SymbolInfoDto } from "src/lib/bifrost/client";

export const selectSymbols: Selector<RootState, SymbolInfoDto[]> = (
  rootState
) => rootState.symbols.symbols;

export const selectSymbolById =
  (symbolId: string): Selector<RootState, SymbolInfoDto> =>
  (rootState) => {
    const symbol = rootState.symbols.symbols.find(
      (symbol) => symbol.symbolId === symbolId
    ) as SymbolInfoDto;

    return symbol;
  };
