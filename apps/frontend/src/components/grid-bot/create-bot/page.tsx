"use client";

import React from "react";
import Grid from "@mui/joy/Grid";
import { BarSize } from "@opentrader/types";

import { TRPCClientErrorBoundary } from "src/ui/errors/suspense";
import { CreateGridBotForm } from "./form";
import {
  ChartBarSize,
  GridChart,
} from "src/components/grid-bot/create-bot/GridChart/GridChart";
import { useIsFirstRender } from "src/hooks/useIsFirstRender";
import {
  changeBarSize,
  setBotName,
  setExchangeAccountId,
  setExchangeCode,
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
  setSymbolId,
} from "src/store/bot-form";
import {
  selectBarSize,
  selectGridLines,
  selectSymbolId,
} from "src/store/bot-form";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { generateBotName } from "src/utils/grid-bot/generateBotName";
import { usePageData } from "./hooks/usePagaData";

export default function CreateGridBotPage() {
  const { exchangeAccount, symbol, lowPrice, highPrice, currentAssetPrice } =
    usePageData();
  const dispatch = useAppDispatch();

  const isFirstRender = useIsFirstRender();
  if (isFirstRender) {
    dispatch(setExchangeAccountId(exchangeAccount.id));
    dispatch(setExchangeCode(exchangeAccount.exchangeCode));
    dispatch(setSymbolId(symbol.symbolId));
    dispatch(setQuantityPerGrid(symbol.filters.lot.minQuantity));
    dispatch(setLowPrice(lowPrice));
    dispatch(setHighPrice(highPrice));
    dispatch(setBotName(generateBotName(symbol)));
  }

  const symbolId = useAppSelector(selectSymbolId);

  const barSize = useAppSelector(selectBarSize) as ChartBarSize; // @todo fix type
  const handleBarSizeChange = (barSize: ChartBarSize) =>
    dispatch(changeBarSize(barSize as BarSize)); // @todo fix type

  const gridLines = useAppSelector(selectGridLines);

  return (
    <Grid container spacing={2}>
      <TRPCClientErrorBoundary>
        <Grid md={9}>
          <GridChart
            symbolId={symbolId}
            barSize={barSize}
            onBarSizeChange={handleBarSizeChange}
            gridLines={gridLines}
            currentAssetPrice={currentAssetPrice}
          />
        </Grid>

        <Grid md={3}>
          <CreateGridBotForm />
        </Grid>
      </TRPCClientErrorBoundary>
    </Grid>
  );
}
