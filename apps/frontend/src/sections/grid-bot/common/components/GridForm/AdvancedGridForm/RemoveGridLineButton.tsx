import { Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { removeGridLine } from "src/sections/grid-bot/create-bot/store/bot-form";
import { useAppDispatch } from "src/store/hooks";
import { GridLinePriceField } from "./fields/GridLinePriceField";
import { GridLineQuantityField } from "./fields/GridLineQuantityField";

const componentName = "RemoveGridLineButton";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Button)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type RemoveGridLineButtonProps = {
  gridLineIndex: number;
  className?: string;
};

export const RemoveGridLineButton: FC<RemoveGridLineButtonProps> = (props) => {
  const { className, gridLineIndex } = props;

  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeGridLine(gridLineIndex));
  };

  return (
    <Root className={className} onClick={handleRemove} color="error">
      Remove
    </Root>
  );
};
