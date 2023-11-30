"use client";

import NextLink from "next/link";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import React, { Suspense } from "react";
import { BotList } from "src/components/grid-bot/bots-list/BotList";
import { BotListSkeleton } from "src/components/grid-bot/bots-list/BotListSkeleton";
import { toPage } from "src/utils/next/toPage";

export default function BotPage() {
  return (
    <Grid container spacing={4}>
      <Grid xs={12}>
        <Button component={NextLink} href={toPage("grid-bot/create")} size="lg">
          Create new bot
        </Button>
      </Grid>

      <Grid xs={12}>
        <Suspense fallback={<BotListSkeleton />}>
          <BotList />
        </Suspense>
      </Grid>
    </Grid>
  );
}
