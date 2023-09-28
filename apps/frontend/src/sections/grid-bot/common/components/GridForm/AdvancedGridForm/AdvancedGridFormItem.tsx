import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { selectGridLines } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";
import { RemoveGridLineButton } from "./RemoveGridLineButton";
import { GridLinePriceField } from "./fields/GridLinePriceField";
import { GridLineQuantityField } from "./fields/GridLineQuantityField";

const componentName = "AdvancedGridFormItem";
const classes = {
  root: `${componentName}-root`,
  field: `${componentName}-field`,
};
const Root = styled(Grid)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.field}`]: {
    marginTop: 16,
  },
}));

type AdvancedGridFormItemProps = {
  gridLineIndex: number;
  className?: string;
};

export const AdvancedGridFormItem: FC<AdvancedGridFormItemProps> = (props) => {
  const { className, gridLineIndex } = props;

  const gridLines = useAppSelector(selectGridLines);

  // The last gridLine is just a SELL order,
  // so the quantity is specified in the prev gridLine.
  const isDisabled = gridLineIndex === gridLines.length - 1;

  return (
    <Root
      className={className}
      container
      item
      xs={12}
      spacing={2}
      alignItems="center"
    >
      <Grid item xs>
        <GridLinePriceField gridLineIndex={gridLineIndex} />
      </Grid>

      <Grid item xs>
        <GridLineQuantityField
          gridLineIndex={gridLineIndex}
          disabled={isDisabled}
        />
      </Grid>

      <Grid item xs="auto">
        <RemoveGridLineButton gridLineIndex={gridLineIndex} />
      </Grid>
    </Root>
  );
};
