import Grid from "@mui/joy/Grid";
import React from "react";
import { BotCard } from "src/components/grid-bot/list/BotCard";
import { tServer } from "src/lib/trpc/server";

export default async function Page() {
  const bots = await tServer.gridBot.list();

  return (
    <Grid container spacing={4}>
      <Grid xl={4} md={5} xs={12}>
        {bots.map((bot, i) => (
          <BotCard
            key={bot.id}
            bot={bot}
            sx={{ marginTop: i !== 0 ? "32px" : undefined }}
          />
        ))}
      </Grid>
    </Grid>
  );
}
