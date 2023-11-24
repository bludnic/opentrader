"use client";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import type { FC } from "react";
import React from "react";
import { SyncClosedOrdersButton } from "src/components/debug/SyncClosedOrdersButton";
import { RunBotTemplateButton } from "src/components/grid-bot/bot-details/RunBotTemplateButton";
import { StartStopBotButton } from "src/components/grid-bot/bot-details/StartStopBotButton";
import { tClient } from "src/lib/trpc/client";
import { BotSettings } from "./BotSettings";

type BotSettingsCardProps = {
  botId: number;
};

export const BotSettingsCard: FC<BotSettingsCardProps> = ({ botId }) => {
  const [bot] = tClient.gridBot.getOne.useSuspenseQuery(botId);

  return (
    <Card>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize="xl2" fontWeight="xl" level="h3">
          {bot.name}
        </Typography>

        <Typography color="neutral" fontSize="xl2" fontWeight="xl" level="h3">
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
