import Grid from "@mui/joy/Grid";
import { ExchangeCode } from "@opentrader/types";
import React from "react";
import CreateGridBotPage from "src/components/grid-bot/create/page";
import { tServer } from "src/lib/trpc/server";

async function fetchData() {
  const exchangeAccounts = await tServer.exchangeAccount.list();
  const exchangeAccount = exchangeAccounts[0];

  const symbols = await tServer.symbol.list(
    exchangeAccount.exchangeCode as ExchangeCode,
  );

  // assume that every exchange has a BTC/USDT pair
  // if not, then get the first one
  const symbol =
    symbols.find((symbol) => symbol.currencyPair === "BTC/USDT") || symbols[0];

  return {
    exchangeAccount,
    symbol,
  };
}

export default async function Page() {
  const { exchangeAccount, symbol } = await fetchData();
  const { lowestCandlestick, highestCandlestick } =
    await tServer.gridBot.formOptions({
      symbolId: symbol.symbolId,
    });

  return (
    <Grid container spacing={2}>
      <CreateGridBotPage
        exchangeAccount={exchangeAccount}
        symbol={symbol}
        highestCandlestick={highestCandlestick}
        lowestCandlestick={lowestCandlestick}
      />
    </Grid>
  );
}
