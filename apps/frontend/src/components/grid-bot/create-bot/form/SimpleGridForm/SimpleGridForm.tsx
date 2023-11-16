"use client";

import React, { FC, Suspense } from "react";
import Grid from "@mui/joy/Grid";
import { InputSkeleton } from "src/ui/InputSkeleton";

import { QuantityPerGridField } from "./fields/QuantityPerGridField";
import { GridLevelsField } from "./fields/GridLevelsField";
import { HighPriceField } from "./fields/HighPriceField";
import { LowPriceField } from "./fields/LowPriceField";

export const SimpleGridForm: FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid md={6} xs={12}>
        <Suspense fallback={<InputSkeleton withLabel />}>
          <HighPriceField />
        </Suspense>
      </Grid>

      <Grid md={6} xs={12}>
        <Suspense fallback={<InputSkeleton withLabel />}>
          <LowPriceField />
        </Suspense>
      </Grid>

      <Grid md={6} xs={12}>
        <Suspense fallback={<InputSkeleton withLabel />}>
          <QuantityPerGridField />
        </Suspense>
      </Grid>

      <Grid md={6} xs={12}>
        <GridLevelsField />
      </Grid>
    </Grid>
  );
};
