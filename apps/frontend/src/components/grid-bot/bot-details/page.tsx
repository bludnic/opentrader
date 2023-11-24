import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import React, { Suspense } from "react";
import { BotSettingsCard } from "src/components/grid-bot/bot-details/BotSettings";
import { GridDetailChart } from "src/components/grid-bot/bot-details/GridDetailChart";
import { ProfitsCard } from "src/components/grid-bot/bot-details/ProfitsCard";
import { SmartTradesTable } from "src/components/grid-bot/bot-details/SmartTradesTable";
import { CHART_HEIGHT } from "src/ui/charts/Chart";

type Props = {
  botId: number;
};

export default function BotDetailsPage(props: Props) {
  const { botId } = props;

  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <Suspense
          fallback={
            <Skeleton
              animation="wave"
              height={CHART_HEIGHT}
              sx={{
                borderRadius: 8,
              }}
              variant="rectangular"
              width="100%"
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
              animation="wave"
              height={CHART_HEIGHT}
              sx={{
                borderRadius: 8,
              }}
              variant="rectangular"
              width="100%"
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
              animation="wave"
              height={250}
              sx={{
                borderRadius: 8,
              }}
              variant="rectangular"
              width="100%"
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
              animation="wave"
              height={250}
              sx={{
                borderRadius: 8,
              }}
              variant="rectangular"
              width="100%"
            />
          }
        >
          <ProfitsCard botId={botId} />
        </Suspense>
      </Grid>
    </Grid>
  );
}
