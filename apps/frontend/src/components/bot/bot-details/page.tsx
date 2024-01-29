import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import React, { Suspense } from "react";
import { ProfitsCard } from "src/components/common/smart-trades/ProfitsCard";
import { BotSettingsCard } from "./BotSettings/BotSettingsCard";
import { CHART_HEIGHT } from "src/ui/charts/Chart";
import { BotSettingsForm } from "./BotSettingsForm/BotSettingsForm";
import { BotChart } from "./BotChart";
import { SmartTradesTable } from "src/components/common/smart-trades/SmartTradesTable";

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
          <BotChart botId={botId} />
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
