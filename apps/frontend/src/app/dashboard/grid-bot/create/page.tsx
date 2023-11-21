"use client";

import Grid from "@mui/joy/Grid";
import { ExchangeCode } from "@opentrader/types";
import React from "react";
import CreateGridBotPage from "src/components/grid-bot/create-bot/page";
import { tClient } from "src/lib/trpc/client";

const useData = () => {
  const [exchangeAccounts] = tClient.exchangeAccount.list.useSuspenseQuery();
  const exchangeAccount = exchangeAccounts[0];

  const [symbols] = tClient.symbol.list.useSuspenseQuery(
    exchangeAccount.exchangeCode as ExchangeCode,
  );

  // assume that every exchange has a BTC/USDT pair
  // if not, then get the first one
  const symbol =
    symbols.find((symbol) => symbol.currencyPair === "BTC/USDT") || symbols[0];

  const [{ price: currentAssetPrice }] = tClient.symbol.price.useSuspenseQuery({
    symbolId: symbol.symbolId,
  });

  return {
    exchangeAccount,
    symbol,
    currentAssetPrice,
  };
};

export default function Page() {
  const { exchangeAccount, symbol, currentAssetPrice } = useData();

  const [{ lowPrice, highPrice }] =
    tClient.gridBot.formOptions.useSuspenseQuery({
      symbolId: symbol.symbolId,
    });

  return (
    <Grid container spacing={2}>
      <CreateGridBotPage
        exchangeAccount={exchangeAccount}
        symbol={symbol}
        lowPrice={lowPrice}
        highPrice={highPrice}
        currentAssetPrice={currentAssetPrice}
      />
    </Grid>
  );
}
