"use client";

import type { ISymbolInfo } from "@opentrader/types";
import type { FC } from "react";
import React from "react";
import { SymbolSelect } from "src/ui/selects/SymbolSelect";
import { tClient } from "src/lib/trpc/client";
import { changeSymbolId } from "src/store/bot-form";
import {
  selectExchangeCode,
  selectSymbolId,
} from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export const PairField: FC = () => {
  const dispatch = useAppDispatch();
  const exchangeCode = useAppSelector(selectExchangeCode);
  const [symbols] = tClient.symbol.list.useSuspenseQuery(exchangeCode);

  const symbolId = useAppSelector(selectSymbolId);
  const handleSymbolIdChange = (symbol: ISymbolInfo | null) => {
    if (symbol === null) {
      throw new Error("PairField: Cannot reset symbol input");
    }

    dispatch(changeSymbolId(symbol.symbolId));
  };

  const symbol = symbols.find((symbol) => symbol.symbolId === symbolId);

  return (
    <SymbolSelect
      exchangeCode={exchangeCode}
      onChange={handleSymbolIdChange}
      value={symbol || null}
    />
  );
};
