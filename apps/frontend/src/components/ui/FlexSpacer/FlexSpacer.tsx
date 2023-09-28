import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";

const componentName = "FlexSpacer";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    flexGrow: 1,
  },
}));

type FlexSpacerProps = {
  className?: string;
};

export const FlexSpacer: FC<FlexSpacerProps> = (props) => {
  const { className } = props;

  return <Root className={clsx(classes.root, className)} />;
};
