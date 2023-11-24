import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import type { FC } from "react";
import React, { Suspense } from "react";
import { selectGridLines } from "src/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";
import { RemoveGridLineButton } from "./RemoveGridLineButton";
import { GridLinePriceField } from "./fields/GridLinePriceField";
import { GridLineQuantityField } from "./fields/GridLineQuantityField";

type AdvancedGridFormItemProps = {
  gridLineIndex: number;
};

export const AdvancedGridFormItem: FC<AdvancedGridFormItemProps> = (props) => {
  const { gridLineIndex } = props;

  const gridLines = useAppSelector(selectGridLines);

  // The last gridLine is just a SELL order,
  // so the quantity is specified in the prev gridLine.
  const isDisabled = gridLineIndex === gridLines.length - 1;

  return (
    <Grid alignItems="flex-end" container spacing={2}>
      <Grid xs>
        <Suspense
          fallback={<Skeleton height={36} variant="rectangular" width={200} />}
        >
          <GridLinePriceField gridLineIndex={gridLineIndex} />
        </Suspense>
      </Grid>

      <Grid xs>
        <Suspense
          fallback={<Skeleton height={36} variant="rectangular" width={200} />}
        >
          <GridLineQuantityField
            disabled={isDisabled}
            gridLineIndex={gridLineIndex}
          />
        </Suspense>
      </Grid>

      <Grid xs="auto">
        <RemoveGridLineButton gridLineIndex={gridLineIndex} />
      </Grid>
    </Grid>
  );
};
