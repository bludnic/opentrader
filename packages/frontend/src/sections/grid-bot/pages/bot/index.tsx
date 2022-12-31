import { CircularProgress, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { gridBotApi } from "src/lib/bifrost/api/gridBot";
import { CompletedDealWithProfitDto } from "src/lib/bifrost/client";
import { BotCard } from "src/sections/grid-bot/common/components/BotCard";
import { useLazyGetBotQuery } from "src/sections/grid-bot/common/store/api";
import { CompletedDealsCard } from "src/sections/grid-bot/pages/bot/components/CompletedDealsCard";
import { GridsCard } from "./components/GridsCard";

const componentName = "BotPage";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BotPageProps = {
  className?: string;
};

export const BotPage: FC<BotPageProps> = (props) => {
  const { className } = props;

  const router = useRouter();

  const [fetchBot, { data, isLoading, error }] = useLazyGetBotQuery();
  useEffect(() => {
    if (!router.query.id) return;

    fetchBot(String(router.query.id));
  }, [router.query.id]);

  const [completedDeals, setCompletedDeals] = useState<
    CompletedDealWithProfitDto[] | null
  >(null);

  useEffect(() => {
    if (!router.query.id) return;

    gridBotApi
      .getCompletedDeals(String(router.query.id))
      .then((res) => setCompletedDeals(res.data.completedDeals));
  }, [router.query.id]);

  if (isLoading) {
    return (
      <Root
        className={classes.root}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
        DrawerProps={{
          back: {
            href: "/grid-bot",
          },
          title: "Grid Bots",
        }}
      >
        <CircularProgress variant="indeterminate" color="primary" />
      </Root>
    );
  }

  if (error) {
    return (
      <Root
        className={classes.root}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
        DrawerProps={{
          back: {
            href: "/grid-bot",
          },
          title: "Grid Bots",
        }}
      >
        {JSON.stringify(error)}
      </Root>
    );
  }

  if (!data) return null;

  return (
    <Root
      className={clsx(classes.root, className)}
      ContainerProps={{
        maxWidth: "xl",
        sx: {
          ml: 0, // align to left
        },
      }}
      DrawerProps={{
        back: {
          href: "/grid-bot",
        },
        title: "Grid Bots",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xl={6} xs={12}>
          <BotCard bot={data.bot} />

          <GridsCard bot={data.bot} sx={{ mt: 2 }} />
        </Grid>

        <Grid container item xl={6} xs={12}>
          <Grid item xs={12}>
            {completedDeals ? (
              <CompletedDealsCard bot={data.bot} deals={completedDeals} />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Root>
  );
};
