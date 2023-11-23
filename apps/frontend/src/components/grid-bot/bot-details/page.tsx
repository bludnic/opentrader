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
              variant="rectangular"
              animation="wave"
              width="100%"
              sx={{
                borderRadius: 8,
              }}
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
              sx={{
                borderRadius: 8,
              }}
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
              sx={{
                borderRadius: 8,
              }}
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
              sx={{
                borderRadius: 8,
              }}
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
