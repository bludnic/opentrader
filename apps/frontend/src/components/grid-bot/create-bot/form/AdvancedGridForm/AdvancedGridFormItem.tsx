import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import React, { FC, Suspense } from "react";
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
    <Grid container spacing={2} alignItems="flex-end">
      <Grid xs>
        <Suspense
          fallback={<Skeleton variant="rectangular" width={200} height={36} />}
        >
          <GridLinePriceField gridLineIndex={gridLineIndex} />
        </Suspense>
      </Grid>

      <Grid xs>
        <Suspense
          fallback={<Skeleton variant="rectangular" width={200} height={36} />}
        >
          <GridLineQuantityField
            gridLineIndex={gridLineIndex}
            disabled={isDisabled}
          />
        </Suspense>
      </Grid>

      <Grid xs="auto">
        <RemoveGridLineButton gridLineIndex={gridLineIndex} />
      </Grid>
    </Grid>
  );
};
