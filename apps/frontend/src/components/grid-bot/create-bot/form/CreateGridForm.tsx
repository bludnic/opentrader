"use client";

import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Skeleton from "@mui/joy/Skeleton";
import { calcGridLinesWithPriceFilter } from "@opentrader/tools";
import type { FC } from "react";
import React, { Suspense } from "react";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import { InputSkeleton } from "src/ui/InputSkeleton";
import { useIsStale } from "src/hooks/useIsStale";
import { tClient } from "src/lib/trpc/client";
import {
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
  updateGridLines,
} from "src/store/bot-form";
import {
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
  selectSymbolId,
} from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { SubmitButton } from "./SubmitButton";
import { FormTypeTabs } from "./FormTypeTabs";
import { BotNameField } from "./fields/BotNameField";
import { AdvancedGridForm } from "./AdvancedGridForm";
import { InvestmentField } from "./fields/InvestmentField";
import { SimpleGridForm } from "./SimpleGridForm";

export const CreateGridBotForm: FC = () => {
  const dispatch = useAppDispatch();

  // Update `quantityPerGrid` when symbol change
  const symbolId = useAppSelector(selectSymbolId);
  const { data: symbol } = tClient.symbol.getOne.useQuery(
    { symbolId },
    {
      refetchOnWindowFocus: false,
    },
  );
  if (useIsStale(symbol)) {
    if (symbol) {
      const quantityPerGrid =
        symbol.filters.limits.amount?.min?.toString() || "";
      dispatch(setQuantityPerGrid(quantityPerGrid));
    }
  }

  // Update high/low prices when symbol change
  const { data: options } = tClient.gridBot.formOptions.useQuery(
    { symbolId },
    {
      refetchOnWindowFocus: false,
    },
  );
  if (useIsStale(options)) {
    if (options) {
      dispatch(setHighPrice(options.highPrice));
      dispatch(setLowPrice(options.lowPrice));
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
        advancedForm={
          <Suspense
            fallback={
              <Skeleton height={60} variant="rectangular" width="100%" />
            }
          >
            <AdvancedGridForm />
          </Suspense>
        }
        simpleForm={<SimpleGridForm />}
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
