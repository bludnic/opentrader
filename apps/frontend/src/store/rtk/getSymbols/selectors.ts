import { decomposeSymbolId } from "@bifrost/tools";
import { ExchangeCode } from "@bifrost/types";
import { Selector } from "@reduxjs/toolkit";
import { rtkApi, SymbolInfoDto } from "src/lib/bifrost/rtkApi";
import { RootState } from "src/store/index";

export const selectSymbols =
  (exchangeCode: ExchangeCode): Selector<RootState, SymbolInfoDto[]> =>
  (rootState) => {
    const { data } = rtkApi.endpoints.getSymbols.select(exchangeCode)(rootState);

    if (data) {
      return data.symbols;
    }

    return [];
  };

export const selectSymbolById =
  (symbolId: string): Selector<RootState, SymbolInfoDto> =>
  (rootState) => {
    const { exchangeCode } = decomposeSymbolId(symbolId)
    const symbols = selectSymbols(exchangeCode)(rootState)

    const symbol = symbols.find(
      (symbol) => symbol.symbolId === symbolId
    ) as SymbolInfoDto; // @todo approach when is undefined

    return symbol;
  };
