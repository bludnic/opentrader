import { composeSymbolId } from "@bifrost/tools";
import { BarSize, ExchangeCode } from "@bifrost/types";
import { CircularProgress, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { trpcApi } from "src/lib/trpc/endpoints";
import { BotCard } from "src/sections/grid-bot/common/components/BotCard";
import { ManualProcessButton } from "src/sections/grid-bot/common/components/BotCard/ManualProcessButton";
import { GridBotChart } from "src/sections/grid-bot/common/components/GridBotChart/GridBotChart";
import { useLazyGetCandlesticksQuery } from "src/lib/markets/marketsApi";
import { startOfYearISO } from "src/utils/date/startOfYearISO";
import { todayISO } from "src/utils/date/todayISO";
import { CompletedSmartTradesCard } from "./components/CompletedSmartTradesCard";
import { ActiveSmartTradesCard } from "./components/ActiveSmartTradesCard";

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

const BotPage: FC<BotPageProps> = (props) => {
  const { className } = props;

  const router = useRouter();

  const { isLoading, isError, error, data } = trpcApi.gridBot.getOne.useQuery({
    input: Number(router.query.id),
  });

  const orders = trpcApi.gridBot.getOrders.useQuery({
    input: {
      botId: Number(router.query.id),
    },
  });

  const [fetchCandlesticks, candlesticks] = useLazyGetCandlesticksQuery();
  useEffect(() => {
    if (!data) return;

    const { baseCurrency, quoteCurrency } = data;
    const symbolId = composeSymbolId(
      ExchangeCode.OKX,
      baseCurrency,
      quoteCurrency,
    ); // @todo extract exchangeCode from GridBotDto

    fetchCandlesticks({
      symbolId,
      timeframe: BarSize.ONE_HOUR,
      startDate: startOfYearISO(),
      endDate: todayISO(),
    });
  }, [data]);

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
        NavigationProps={{
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

  if (isError) {
    return (
      <Root
        className={classes.root}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
        NavigationProps={{
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

  return (
    <Root
      className={clsx(classes.root, className)}
      ContainerProps={{
        maxWidth: false,
        sx: {
          ml: 0, // align to left
        },
      }}
      NavigationProps={{
        back: {
          href: "/grid-bot",
        },
        title: "Grid Bots",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xl={4} md={6} xs={12}>
          <BotCard bot={data} />

          <ActiveSmartTradesCard bot={data} sx={{ mt: 2 }} />

          <CompletedSmartTradesCard bot={data} sx={{ mt: 2 }} />

          <ManualProcessButton bot={data} />
        </Grid>

        <Grid container item xl={8} xs={12}>
          <Grid item xs={12}>
            {candlesticks.status === "fulfilled" && candlesticks.data ? (
              <GridBotChart
                orders={orders.data ? orders.data : undefined}
                candlesticks={candlesticks.data.candlesticks}
                gridLines={data.settings.gridLines}
              />
            ) : (
              "Loading candlesticks..."
            )}
          </Grid>
        </Grid>
      </Grid>
    </Root>
  );
};

export default BotPage;
