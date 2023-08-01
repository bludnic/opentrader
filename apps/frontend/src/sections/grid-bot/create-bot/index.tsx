import { calcGridLinesWithPriceFilter } from "@bifrost/tools";
import { Box, Card, CardContent, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import React, { FC, useEffect } from "react";
import { MainLayout } from "src/layouts/main";
import { GridBotChart } from "src/sections/grid-bot/common/components/GridBotChart/GridBotChart";
import { CreateGridBotForm } from "src/sections/grid-bot/common/components/GridForm";
import {
  selectBarSize,
  selectCurrencyPair,
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { initPage } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { isPageReadySelector } from "src/sections/grid-bot/create-bot/store/init-page/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { rtkApi } from "src/lib/bifrost/rtkApi";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";

const componentName = "CreateBotPage";
const classes = {
  root: `${componentName}-root`,
  BotCard: `${componentName}-BotCard`,
};

const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

const CreateBotPage: FC = () => {
  const isPageReady = useAppSelector(isPageReadySelector);

  const highPrice = useAppSelector(selectHighPrice);
  const lowPrice = useAppSelector(selectLowPrice);
  const gridLinesNumber = useAppSelector(selectGridLinesNumber);
  const quantityPerGrid = useAppSelector(selectQuantityPerGrid);
  const currencyPair = useAppSelector(selectCurrencyPair);
  const barSize = useAppSelector(selectBarSize);
  const symbol = useAppSelector(selectSymbolById(currencyPair));

  const candlesticks = useAppSelector(
    rtkApi.endpoints.getCandlesticksHistory.select({
      symbolId: currencyPair,
      barSize,
    })
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initPage());
  }, []);

  const gridLines = symbol
    ? calcGridLinesWithPriceFilter(
        highPrice,
        lowPrice,
        gridLinesNumber,
        Number(quantityPerGrid),
        symbol.filters
      )
    : [];

  if (isPageReady) {
    return (
      <Root
        className={classes.root}
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
          <Grid container item xs={12} md={8}>
            <Card style={{ width: "100%" }}>
              <CardContent>
                {candlesticks.status === "fulfilled" ? (
                  <GridBotChart
                    candlesticks={candlesticks.data.history.candlesticks}
                    gridLines={gridLines}
                  />
                ) : (
                  "Loading candlesticks..."
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid container item xs={12} md={4}>
            <Box>
              <Card>
                <CardContent>
                  <CreateGridBotForm />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Root>
    );
  }

  return (
    <Root
      className={classes.root}
      ContainerProps={{
        maxWidth: "sm",
        sx: {
          ml: 0, // align to left
        },
      }}
    >
      <CircularProgress variant="indeterminate" color="primary" />
    </Root>
  );
};

export default CreateBotPage;
