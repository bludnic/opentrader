import React from "react";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import NextLink from "next/link";
import { BotListSkeleton } from "./BotListSkeleton";

export default function Loading() {
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

      <Grid xs={12}>
        <BotListSkeleton />
      </Grid>
    </Grid>
  );
}
