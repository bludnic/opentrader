"use client";

import type { SxProps } from "@mui/joy/styles/types";
import type { FC } from "react";
import React from "react";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";

type Props = {
  gridVisible: boolean;
  onGridVisibleChange: (visibility: boolean) => void;
  tradesVisible?: boolean;
  onTradesVisibleChange?: (visibility: boolean) => void;
  hideTradesButton?: boolean;
};

const buttonMixin =
  (bgColor: string) =>
  (visibility?: boolean): SxProps => ({
    backgroundColor: visibility ? bgColor : undefined,
    "&:hover": {
      backgroundColor: visibility ? bgColor : "unset",
    },
  });

export const ChartOptions: FC<Props> = ({
  gridVisible,
  onGridVisibleChange,
  tradesVisible,
  onTradesVisibleChange,
  hideTradesButton,
}) => {
  return (
    <ButtonGroup size="sm" variant="outlined">
      <Button
        color={gridVisible ? "primary" : "neutral"}
        onClick={() => onGridVisibleChange(!gridVisible)}
        startDecorator={<DensityMediumIcon />}
        sx={(theme) => ({
          ...buttonMixin(theme.vars.palette.primary.outlinedHoverBg)(
            gridVisible,
          ),
        })}
      >
        Grid
      </Button>

      {!hideTradesButton ? (
        <Button
          color={tradesVisible ? "success" : "neutral"}
          onClick={() => onTradesVisibleChange?.(!tradesVisible)}
          startDecorator={<RadioButtonCheckedIcon />}
          sx={(theme) => ({
            ...buttonMixin(theme.vars.palette.success.outlinedHoverBg)(
              tradesVisible,
            ),
          })}
        >
          Trades
        </Button>
      ) : null}
    </ButtonGroup>
  );
};
