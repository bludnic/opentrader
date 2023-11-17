"use client";

import NextLink from "next/link";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import React, { Suspense } from "react";
import { BotList } from "src/components/grid-bot/bots-list/BotList";
import { BotListSkeleton } from "src/components/grid-bot/bots-list/BotListSkeleton";
import { tClient } from "src/lib/trpc/client";

export default function Page() {
  const [bots] = tClient.gridBot.list.useSuspenseQuery();

  return (
    <Grid container spacing={4}>
      <Grid xs={12}>
        <Button
          size="lg"
          component={NextLink}
          href="/dashboard/grid-bot/create"
        >
          Create new bot
        </Button>
      </Grid>

      <Grid xl={4} md={5} xs={12}>
        <Suspense fallback={<BotListSkeleton />}>
          <BotList />
        </Suspense>
      </Grid>
    </Grid>
  );
}
