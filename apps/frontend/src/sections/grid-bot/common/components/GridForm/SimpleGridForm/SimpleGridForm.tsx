import { Divider, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { QuantityPerGridField } from "./fields/QuantityPerGridField";
import { GridLevelsField } from "./fields/GridLevelsField";
import { HighPriceField } from "./fields/HighPriceField";
import { LowPriceField } from "./fields/LowPriceField";

const componentName = "CreateBotForm";
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

type SimpleGridFormProps = {
  className?: string;
};

export const SimpleGridForm: FC<SimpleGridFormProps> = (props) => {
  const { className } = props;

  return (
    <Root className={clsx(classes.root, className)} container spacing={2}>
      <Grid item xs={12}>
        <Divider>Simple settings</Divider>
      </Grid>

      <Grid container item xs={12} spacing={2}>
        <Grid item md={6} xs={12}>
          <HighPriceField />
        </Grid>

        <Grid item md={6} xs={12}>
          <LowPriceField />
        </Grid>

        <Grid item md={6} xs={12}>
          <QuantityPerGridField />
        </Grid>

        <Grid item md={6} xs={12}>
          <GridLevelsField />
        </Grid>
      </Grid>
    </Root>
  );
};
