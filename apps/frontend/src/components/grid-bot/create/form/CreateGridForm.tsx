"use client";

import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Skeleton from "@mui/joy/Skeleton";
import { calcGridLinesWithPriceFilter } from "@opentrader/tools";
import React, { FC, Suspense } from "react";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import { BotNameField } from "./fields/BotNameField";
import { FormTypeTabs } from "./FormTypeTabs";
import { InputSkeleton } from "src/components/joy/ui/InputSkeleton";
import { useIsStale } from "src/hooks/useIsStale";
import { tClient } from "src/lib/trpc/client";
import {
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
  updateGridLines,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import { SubmitButton } from "./SubmitButton";
import {
  selectFormType,
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
  selectSymbolId,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { AdvancedGridForm } from "./AdvancedGridForm";
import { InvestmentField } from "./fields/InvestmentField";
import { SimpleGridForm } from "./SimpleGridForm";

export const CreateGridBotForm: FC = () => {
  const dispatch = useAppDispatch();

  // Update `quantityPerGrid` when symbol change
  const symbolId = useAppSelector(selectSymbolId);
  const { data: symbol } = tClient.symbol.getOne.useQuery({ symbolId });
  if (useIsStale(symbol)) {
    if (symbol) {
      dispatch(setQuantityPerGrid(symbol.filters.lot.minQuantity));
    }
  }

  // Update high/low prices when symbol change
  const { data: options } = tClient.gridBot.formOptions.useQuery({ symbolId });
  if (useIsStale(options)) {
    if (options) {
      dispatch(setHighPrice(options.highestCandlestick.open));
      dispatch(setLowPrice(options.lowestCandlestick.open));
    }
  }

  // Recalculate grid lines
  const highPrice = useAppSelector(selectHighPrice);
  const lowPrice = useAppSelector(selectLowPrice);
  const gridLinesNumber = useAppSelector(selectGridLinesNumber);
  const quantityPerGrid = useAppSelector(selectQuantityPerGrid);

  const isStale = [
    useIsStale(highPrice),
    useIsStale(lowPrice),
    useIsStale(gridLinesNumber),
    useIsStale(quantityPerGrid),
    useIsStale(symbol),
  ].includes(true);

  if (isStale) {
    if (symbol) {
      const gridLines = calcGridLinesWithPriceFilter(
        highPrice,
        lowPrice,
        gridLinesNumber,
        Number(quantityPerGrid),
        symbol.filters,
      );

      dispatch(updateGridLines(gridLines));
    }
  }

  return (
    <Card
      sx={{
        padding: 0,
      }}
    >
      <FormTypeTabs
        simpleForm={<SimpleGridForm />}
        advancedForm={
          <Suspense
            fallback={
              <Skeleton variant="rectangular" width="100%" height={60} />
            }
          >
            <AdvancedGridForm />
          </Suspense>
        }
      />

      <Divider />

      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Suspense fallback={<InputSkeleton withLabel />}>
              <InvestmentField />
            </Suspense>
          </Grid>

          <Grid xs={12}>
            <BotNameField />
          </Grid>

          <Grid xs={12}>
            <SubmitButton />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};
