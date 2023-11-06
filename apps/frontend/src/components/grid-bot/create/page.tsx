"use client";

import React from "react";
import Grid from "@mui/joy/Grid";
import { BarSize, ICandlestick } from "@opentrader/types";

import { CreateGridBotForm } from "./form";
import { ChartBarSize, GridChart } from "./GridChart";
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
} from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectBarSize,
  selectGridLines,
  selectSymbolId,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { TExchangeAccount, TSymbol } from "src/types/trpc";
import { generateBotName } from "src/utils/grid-bot/generateBotName";

type Props = {
  exchangeAccount: TExchangeAccount;
  symbol: TSymbol;
  lowestCandlestick: ICandlestick;
  highestCandlestick: ICandlestick;
};

export default function CreateGridBotPage(props: Props) {
  const { exchangeAccount, symbol, lowestCandlestick, highestCandlestick } =
    props;
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
    <>
      <Grid md={9}>
        <GridChart
          symbolId={symbolId}
          barSize={barSize}
          onBarSizeChange={handleBarSizeChange}
          gridLines={gridLines}
        />
      </Grid>

      <Grid md={3}>
        <CreateGridBotForm />
      </Grid>
    </>
  );
}
