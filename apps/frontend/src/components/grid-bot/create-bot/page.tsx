"use client";

import React from "react";
import Grid from "@mui/joy/Grid";
import { BarSize, ICandlestick } from "@opentrader/types";

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
import { TExchangeAccount, TSymbol } from "src/types/trpc";
import { generateBotName } from "src/utils/grid-bot/generateBotName";

type Props = {
  exchangeAccount: TExchangeAccount;
  symbol: TSymbol;
  lowestCandlestick: ICandlestick;
  highestCandlestick: ICandlestick;
  currentAssetPrice: number;
};

export default function CreateGridBotPage(props: Props) {
  const {
    exchangeAccount,
    symbol,
    lowestCandlestick,
    highestCandlestick,
    currentAssetPrice,
  } = props;
  const dispatch = useAppDispatch();

  const isFirstRender = useIsFirstRender();
  if (isFirstRender) {
    dispatch(setExchangeAccountId(exchangeAccount.id));
    dispatch(setExchangeCode(exchangeAccount.exchangeCode));
    dispatch(setSymbolId(symbol.symbolId));
    dispatch(setQuantityPerGrid(symbol.filters.lot.minQuantity));
    dispatch(setLowPrice(lowestCandlestick.open));
    dispatch(setHighPrice(highestCandlestick.open));
    dispatch(setBotName(generateBotName(symbol)));
  }

  const symbolId = useAppSelector(selectSymbolId);

  const barSize = useAppSelector(selectBarSize) as ChartBarSize; // @todo fix type
  const handleBarSizeChange = (barSize: ChartBarSize) =>
    dispatch(changeBarSize(barSize as BarSize)); // @todo fix type

  const gridLines = useAppSelector(selectGridLines);

  return (
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
  );
}
