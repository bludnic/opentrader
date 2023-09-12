import { Card, CardContent, Divider, SxProps, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import clsx from "clsx";
import { trpc } from "src/lib/trpc";
import { TGridBot } from "src/sections/grid-bot/common/trpc-types";

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
  bot: TGridBot;
};

export const ActiveSmartTradesCard: FC<ActiveSmartTradesCardProps> = (
  props,
) => {
  const { className, bot, sx } = props;

  const { isLoading, isError, error, data } = useQuery(
    ["gridBotActiveSmartTrades", bot.id],
    async () =>
      trpc.gridBot.activeSmartTrades.query({
        botId: bot.id,
      }),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <CardRoot className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography variant="h6">Active STs</Typography>
      </CardContent>

      <Divider />

      <GridsTable bot={bot} activeSmartTrades={data} />
    </CardRoot>
  );
};
