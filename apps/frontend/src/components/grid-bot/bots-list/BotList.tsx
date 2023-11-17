"use client";

import React, { FC } from "react";
import { BotCard } from "src/components/grid-bot/bots-list/BotCard";
import { tClient } from "src/lib/trpc/client";

export const BotList: FC = () => {
  const [bots] = tClient.gridBot.list.useSuspenseQuery();

  return (
    <>
      {bots.map((bot, i) => (
        <BotCard
          key={bot.id}
          bot={bot}
          sx={{ marginTop: i !== 0 ? "32px" : undefined }}
        />
      ))}
    </>
  );
};
