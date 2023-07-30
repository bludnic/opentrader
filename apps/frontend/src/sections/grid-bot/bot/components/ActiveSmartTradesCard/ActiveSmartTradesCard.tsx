import { Card, CardContent, Divider, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import React, { FC } from "react";
import clsx from "clsx";
import { GridBotDto, SmartTradeDto } from "src/lib/bifrost/client";
import { GridsTable } from "./components/GridsTable";

const componentName = "ActiveSmartTradesCard";
const classes = {
  root: `${componentName}-root`,
};
const CardRoot = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type ActiveSmartTradesCardProps = {
  className?: string;
  sx?: SxProps<Theme>;
  bot: GridBotDto;
  activeSmartTrades: SmartTradeDto[];
};

export const ActiveSmartTradesCard: FC<ActiveSmartTradesCardProps> = (
  props
) => {
  const { className, bot, activeSmartTrades, sx } = props;

  return (
    <CardRoot className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography variant="h6">Active STs</Typography>
      </CardContent>

      <Divider />

      <GridsTable bot={bot} activeSmartTrades={activeSmartTrades} />
    </CardRoot>
  );
};
