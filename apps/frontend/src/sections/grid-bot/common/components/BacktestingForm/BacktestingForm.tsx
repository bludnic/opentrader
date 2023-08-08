import React, { FC } from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { StartDateField } from "./fields/StartDateField";
import { EndDateField } from "./fields/EndDateField";

const componentName = "BacktestingForm";
const classes = {
  root: `${componentName}-root`,
  field: `${componentName}-field`,
};
const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.field}`]: {
    marginTop: 16,
  },
}));

type BacktestingFormProps = {
  className?: string;
};

export const BacktestingForm: FC<BacktestingFormProps> = (props) => {
  const { className } = props;

  return (
    <Root className={clsx(classes.root, className)}>
      <Grid container spacing={2} mb={3}>
        <Grid item md={6} xs={12}>
          <StartDateField />
        </Grid>

        <Grid item md={6} xs={12}>
          <EndDateField />
        </Grid>
      </Grid>
    </Root>
  );
};
