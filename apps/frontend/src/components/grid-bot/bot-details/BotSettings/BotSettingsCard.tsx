"use client";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import React, { FC } from "react";
import { SyncClosedOrdersButton } from "src/components/debug/SyncClosedOrdersButton";
import { BotSettings } from "./BotSettings";
import { RunBotTemplateButton } from "src/components/grid-bot/bot-details/RunBotTemplateButton";
import { StartStopBotButton } from "src/components/grid-bot/bot-details/StartStopBotButton";
import { tClient } from "src/lib/trpc/client";

type BotSettingsCardProps = {
  botId: number;
};

export const BotSettingsCard: FC<BotSettingsCardProps> = ({ botId }) => {
  const [bot] = tClient.gridBot.getOne.useSuspenseQuery(botId);

  return (
    <Card>
      <Box display="flex" justifyContent="space-between">
        <Typography level="h3" fontSize="xl2" fontWeight="xl">
          {bot.name}
        </Typography>

        <Typography level="h3" fontSize="xl2" fontWeight="xl" color="neutral">
          #{bot.id}
        </Typography>
      </Box>

      <BotSettings bot={bot} />

      <StartStopBotButton bot={bot} />

      <RunBotTemplateButton bot={bot} />

      <SyncClosedOrdersButton polling={false} />
    </Card>
  );
};
