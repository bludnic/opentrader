import { calcGridLinesWithPriceFilter } from "@bifrost/tools";
import { Box, Card, CardContent, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { MainLayout } from "src/layouts/main";
import { GridBotChart } from "src/sections/grid-bot/common/components/GridBotChart/GridBotChart";
import { CreateGridBotForm } from "src/sections/grid-bot/common/components/GridForm";
import { useSymbol } from "src/sections/grid-bot/create-bot/hooks/useSymbol";
import {
  selectBarSize,
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
  selectSymbolId,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";
import { marketsApi } from "src/lib/markets/marketsApi";
import { startOfYearISO } from "src/utils/date/startOfYearISO";
import { todayISO } from "src/utils/date/todayISO";
import { BacktestingCard } from "../common/components/BacktestingCard/BacktestingCard";
import { useBacktesting } from "./hooks/useBacktesting";

const componentName = "CreateBotPage";
const classes = {
  root: `${componentName}-root`,
  BotCard: `${componentName}-BotCard`,
};

const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

const Page: FC = () => {
  const highPrice = useAppSelector(selectHighPrice);
  const lowPrice = useAppSelector(selectLowPrice);
  const gridLinesNumber = useAppSelector(selectGridLinesNumber);
  const quantityPerGrid = useAppSelector(selectQuantityPerGrid);
  const symbolId = useAppSelector(selectSymbolId);
  const barSize = useAppSelector(selectBarSize);
  const symbol = useSymbol();

  const candlesticks = useAppSelector(
    marketsApi.endpoints.getCandlesticks.select({
      symbolId,
      timeframe: barSize,
      startDate: startOfYearISO(),
      endDate: todayISO(),
    }),
  );

  const gridLines = symbol
    ? calcGridLinesWithPriceFilter(
        highPrice,
        lowPrice,
        gridLinesNumber,
        Number(quantityPerGrid),
        symbol.filters,
      )
    : [];

  const { runBacktest, backtestQuery } = useBacktesting(gridLines);

  return (
    <Root
      className={classes.root}
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
        <Grid container item xs={12} md={12} xl={8}>
          <Card style={{ width: "100%" }}>
            <CardContent>
              {candlesticks.status === "fulfilled" ? (
                <GridBotChart
                  candlesticks={candlesticks.data.candlesticks}
                  gridLines={gridLines}
                />
              ) : (
                "Loading candlesticks..."
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid container item xs={12} md={12} xl={4}>
          <Box>
            <Card>
              <CardContent>
                <CreateGridBotForm />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid container item xs={12}>
          <BacktestingCard
            onRun={runBacktest}
            isLoading={backtestQuery.isLoading}
            data={backtestQuery.data}
          />
        </Grid>
      </Grid>
    </Root>
  );
};

export default Page;
