import { calcGridLines, composeSymbolId } from "@bifrost/tools";
import { ExchangeCode } from "@bifrost/types";
import { CircularProgress, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import { SmartTradeDto } from "src/lib/bifrost/client";
import { BotCard } from "src/sections/grid-bot/common/components/BotCard";
import { GridBotChart } from "src/sections/grid-bot/common/components/GridBotChart/GridBotChart";
import { useLazyGetBotQuery } from "src/sections/grid-bot/common/store/api/botsApi";
import { useLazyGetCompletedSmartTradesQuery } from "src/sections/grid-bot/common/store/api/completedDealsApi";
import {
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { fetchCandlesticks, requestCandlesticks } from "src/store/candlesticks";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { FetchStatus } from "src/utils/redux/types";
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
  const dispatch = useAppDispatch();

  const [fetchBot, botQuery] = useLazyGetBotQuery();
  useEffect(() => {
    if (!router.query.id) return;

    fetchBot(String(router.query.id));
  }, [router.query.id]);

  const [fetchCompletedSmartTrades, smartTradesQuery] =
    useLazyGetCompletedSmartTradesQuery();
  useEffect(() => {
    if (!router.query.id) return;

    fetchCompletedSmartTrades(String(router.query.id));
  }, [router.query.id]);

  const [activeSmartTrades, setActiveSmartTrades] = useState<SmartTradeDto[]>(
    []
  );
  useEffect(() => {
    if (!router.query.id) return;

    bifrostApi.getActiveSmartTrades(String(router.query.id)).then((res) => {
      setActiveSmartTrades(res.data.activeSmartTrades);
    });
  }, [router.query.id]);

  const { candlesticks, status: candlesticksStatus } = useAppSelector(
    (rootState) => rootState.candlesticks
  );
  useEffect(() => {
    if (!botQuery.data) return;

    const { baseCurrency, quoteCurrency } = botQuery.data.bot;
    const symbolId = composeSymbolId(
      ExchangeCode.OKX,
      baseCurrency,
      quoteCurrency
    ); // @todo extract exchangeCode from GridBotDto

    dispatch(
      requestCandlesticks({
        symbolId,
      })
    );
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
        DrawerProps={{
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
      DrawerProps={{
        back: {
          href: "/grid-bot",
        },
        title: "Grid Bots",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xl={4} xs={12}>
          <BotCard bot={botQuery.data.bot} />

          <ActiveSmartTradesCard
            bot={botQuery.data.bot}
            activeSmartTrades={activeSmartTrades}
            sx={{ mt: 2 }}
          />

          {smartTradesQuery.data ? (
            <CompletedSmartTradesCard
              bot={botQuery.data.bot}
              smartTrades={smartTradesQuery.data.completedSmartTrades}
              sx={{ mt: 2 }}
            />
          ) : null}
        </Grid>

        <Grid container item xl={8} xs={12}>
          <Grid item xs={12}>
            {candlesticksStatus === FetchStatus.Loading ||
            candlesticksStatus === FetchStatus.Idle ? (
              "Loading candlesticks..."
            ) : (
              <GridBotChart
                candlesticks={candlesticks}
                gridLines={botQuery.data.bot.gridLines}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Root>
  );
};

export default BotPage;
