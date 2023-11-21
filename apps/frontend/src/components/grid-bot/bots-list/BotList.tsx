"use client";

import Grid from "@mui/joy/Grid";
import React, { FC } from "react";
import { BotCard } from "src/components/grid-bot/bots-list/BotCard";
import { tClient } from "src/lib/trpc/client";

export const BotList: FC = () => {
  const [bots] = tClient.gridBot.list.useSuspenseQuery();

  return (
    <Grid container spacing={2}>
      {bots.map((bot, i) => (
        <Grid key={bot.id} xl={3} md={4} sm={6} xs={12}>
          <BotCard bot={bot} />
        </Grid>
      ))}
    </Grid>
  );
};
