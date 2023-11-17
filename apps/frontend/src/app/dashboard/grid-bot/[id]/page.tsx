"use client";

import Skeleton from "@mui/joy/Skeleton";
import React, { Suspense } from "react";
import { BotSettingsCard } from "src/components/grid-bot/bot-details/BotSettings";
import { ProfitsCard } from "src/components/grid-bot/bot-details/ProfitsCard";
import { GridDetailChart } from "src/components/grid-bot/bot-details/GridDetailChart";
import { SmartTradesTable } from "src/components/grid-bot/bot-details/SmartTradesTable";
import Grid from "@mui/joy/Grid";
import { CHART_HEIGHT } from "src/ui/charts/Chart";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const botId = Number(params.id);

  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height={CHART_HEIGHT}
            />
          }
        >
          <GridDetailChart botId={botId} />
        </Suspense>
      </Grid>

      <Grid md={3}>
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height={CHART_HEIGHT}
            />
          }
        >
          <BotSettingsCard botId={botId} />
        </Suspense>
      </Grid>

      <Grid md={9}>
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height={250}
            />
          }
        >
          <SmartTradesTable botId={botId} />
        </Suspense>
      </Grid>

      <Grid md={3}>
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height={250}
            />
          }
        >
          <ProfitsCard botId={botId} />
        </Suspense>
      </Grid>
    </Grid>
  );
}
