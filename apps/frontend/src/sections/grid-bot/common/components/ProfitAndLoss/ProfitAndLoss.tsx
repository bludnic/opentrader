import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";

const componentName = "ProfitAndLoss";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Typography)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type ProfitAndLossProps = {
  className?: string;
  pnl: number;
  suffix: string;
};

export const ProfitAndLoss: FC<ProfitAndLossProps> = (props) => {
  const { className, pnl, suffix } = props;

  if (pnl > 0) {
    return (
      <Root
        className={clsx(classes.root, className)}
        color="success.main"
        variant="h6"
      >
        +{pnl}
        {suffix}
      </Root>
    );
  }

  return (
    <Root
      className={clsx(classes.root, className)}
      color="error.main"
      variant="h6"
    >
      -{pnl}
      {suffix}
    </Root>
  );
};
