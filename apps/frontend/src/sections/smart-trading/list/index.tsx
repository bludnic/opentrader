import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import React, { FC, useState } from "react";
import { CryptoCoinSelector } from "src/components/ui/CryptoCoinSelector";
import { ExchangeAccountSelector } from "src/components/ui/ExchangeAccountSelector";
import { MainLayout } from "src/layouts/main";
import { trpcApi } from "src/lib/trpc/endpoints";
import { useCandlesticks } from "src/sections/smart-trading/list/hooks/useCandlesticks";
import { TExchangeAccount, TSymbol } from "src/types/trpc";
import { SmartTradesTable } from "./components/SmartTradesTable";
import { SmartTradingChart } from "src/sections/smart-trading/common/components/SmartTradingChart/SmartTradingChart";

const componentName = "SmartTradingPage";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

export const SmartTradingPage: FC = () => {
  const { isLoading, isError, error, data } =
    trpcApi.smartTrade.list.useQuery();

  const candlesticks = useCandlesticks("OKX:BTC/USDT");
  const [exchangeAccount, setExchangeAccount] =
    useState<TExchangeAccount | null>(null);
  const [symbol, setSymbol] = useState<TSymbol | null>(null);

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
          maxWidth: "md",
          sx: {
            ml: 0, // align to left
          },
        }}
      >
        {JSON.stringify(error)}
      </Root>
    );
  }

  return (
    <Root
      className={classes.root}
      ContainerProps={{
        maxWidth: "lg",
        sx: {
          ml: 0, // align to left,
        },
      }}
      NavigationProps={{
        title: "Smart Trading",
      }}
    >
      <Grid container spacing={0}>
        <Grid item xl={12} md={12} xs={12}>
          <ExchangeAccountSelector
            value={exchangeAccount}
            onChange={setExchangeAccount}
          />
          {exchangeAccount ? (
            <CryptoCoinSelector
              exchangeCode={exchangeAccount.exchangeCode}
              value={symbol}
              onChange={setSymbol}
            />
          ) : null}

          {candlesticks ? (
            <SmartTradingChart candlesticks={candlesticks} />
          ) : null}

          <SmartTradesTable trades={data} />
        </Grid>
      </Grid>
    </Root>
  );
};
