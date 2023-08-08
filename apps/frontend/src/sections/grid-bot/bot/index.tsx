import { composeSymbolId } from "@bifrost/tools";
import { BarSize, ExchangeCode } from "@bifrost/types";
import { CircularProgress, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { BotCard } from "src/sections/grid-bot/common/components/BotCard";
import { GridBotChart } from "src/sections/grid-bot/common/components/GridBotChart/GridBotChart";
import {
  useGetGridBotQuery,
  useLazyGetCandlesticksHistoryQuery,
} from "src/lib/bifrost/rtkApi";
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

  const botQuery = useGetGridBotQuery(String(router.query.id));

  const [fetchCandlesticks, candlesticks] =
    useLazyGetCandlesticksHistoryQuery();
  useEffect(() => {
    if (!botQuery.data) return;

    const { baseCurrency, quoteCurrency } = botQuery.data.bot;
    const symbolId = composeSymbolId(
      ExchangeCode.OKX,
      baseCurrency,
      quoteCurrency
    ); // @todo extract exchangeCode from GridBotDto

    fetchCandlesticks({
      symbolId,
      barSize: BarSize.FOUR_HOURS,
    });
  }, [botQuery.data]);

  if (botQuery.isLoading) {
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

  if (botQuery.error) {
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
        {JSON.stringify(botQuery.error)}
      </Root>
    );
  }

  if (!botQuery.data) return null;

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
          <BotCard bot={botQuery.data.bot} />

          <ActiveSmartTradesCard bot={botQuery.data.bot} sx={{ mt: 2 }} />

          <CompletedSmartTradesCard bot={botQuery.data.bot} sx={{ mt: 2 }} />
        </Grid>

        <Grid container item xl={8} xs={12}>
          <Grid item xs={12}>
            {candlesticks.status === "fulfilled" && candlesticks.data ? (
              <GridBotChart
                candlesticks={candlesticks.data.history.candlesticks}
                gridLines={botQuery.data.bot.gridLines}
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
