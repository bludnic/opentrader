"use client";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import type { FC } from "react";
import React from "react";
import { SyncClosedOrdersButton } from "src/components/debug/SyncClosedOrdersButton";
import { tClient } from "src/lib/trpc/client";
import { BotAdditionalActions } from "../BotActions/BotAdditionalActions";
import { RunBotTemplateButton } from "../BotActions/actions/RunBotTemplateButton";
import { StartStopBotButton } from "../BotActions/actions/StartStopBotButton";
import { DeleteBotButton } from "../BotActions/actions/DeleteBotButton";
import { BotActions } from "../BotActions/BotActions";
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

      <BotActions>
        <StartStopBotButton bot={bot} />
      </BotActions>

      <BotAdditionalActions>
        <SyncClosedOrdersButton polling={false} />
        <RunBotTemplateButton bot={bot} />
        <DeleteBotButton bot={bot} />
      </BotAdditionalActions>
    </Card>
  );
};
