"use client";

import type { FC } from "react";
import React from "react";
import Grid from "@mui/joy/Grid";
import Divider from "@mui/joy/Divider";
import type { TGridBot, TSymbol } from "src/types/trpc";
import { calcAverageQuantityPerGrid } from "src/utils/grid-bot/calcAverageQuantityPerGrid";
import { findHighestGridLinePrice } from "src/utils/grid-bot/findHighestGridLinePrice";
import { findLowestGridLinePrice } from "src/utils/grid-bot/findLowestGridLinePrice";
import { SettingInput } from "./SettingInput";

type SimpleGridFormProps = {
  bot: TGridBot;
  symbol: TSymbol;
};

export const GridBotSettings: FC<SimpleGridFormProps> = ({ bot }) => {
  const highPrice = findHighestGridLinePrice(bot.settings.gridLines);
  const lowPrice = findLowestGridLinePrice(bot.settings.gridLines);
  const averageQuantityPerGrid = calcAverageQuantityPerGrid(
    bot.settings.gridLines,
  );

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Divider>Bot settings</Divider>
      </Grid>

      <Grid container spacing={2} xs={12}>
        <Grid md={6} xs={12}>
          <SettingInput label="High price" value={highPrice} />
        </Grid>

        <Grid md={6} xs={12}>
          <SettingInput label="Low price" value={lowPrice} />
        </Grid>

        <Grid md={6} xs={12}>
          <SettingInput
            label="Quantity per grid"
            value={averageQuantityPerGrid}
          />
        </Grid>

        <Grid md={6} xs={12}>
          <SettingInput
            label="Grid levels"
            value={bot.settings.gridLines.length}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
