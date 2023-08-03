import { Card, CardContent, Divider, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { QueryStatus } from "@reduxjs/toolkit/query";
import React, { FC } from "react";
import clsx from "clsx";
import {
  GridBotDto,
  useGetGridBotActiveSmartTradesQuery,
} from "src/lib/bifrost/rtkApi";

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
};

export const ActiveSmartTradesCard: FC<ActiveSmartTradesCardProps> = (
  props
) => {
  const { className, bot, sx } = props;
  const query = useGetGridBotActiveSmartTradesQuery(bot.id);

  if (query.status === QueryStatus.fulfilled && query.data) {
    return (
      <CardRoot className={clsx(classes.root, className)} sx={sx}>
        <CardContent>
          <Typography variant="h6">Active STs</Typography>
        </CardContent>

        <Divider />

        <GridsTable
          bot={bot}
          activeSmartTrades={query.data.activeSmartTrades}
        />
      </CardRoot>
    );
  }

  return null;
};
