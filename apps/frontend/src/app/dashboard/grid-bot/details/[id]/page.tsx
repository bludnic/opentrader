import Card from "@mui/joy/Card";
import { composeSymbolId } from "@opentrader/tools";
import { ExchangeCode } from "@opentrader/types";
import React from "react";
import { GridBotSettings } from "src/components/grid-bot/details/GridBotSettings";
import { GridDetailChart } from "src/components/grid-bot/details/GridDetailChart";
import { tServer } from "src/lib/trpc/server";
import Grid from "@mui/joy/Grid";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const bot = await tServer.gridBot.getOne(Number(params.id));

  const exchangeAccount = await tServer.exchangeAccount.getOne(
    bot.exchangeAccountId,
  );

  const symbol = await tServer.symbol.getOne({
    symbolId: composeSymbolId(
      exchangeAccount.exchangeCode as ExchangeCode,
      bot.baseCurrency,
      bot.quoteCurrency,
    ),
  });

  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <GridDetailChart symbol={symbol} exchangeAccount={exchangeAccount} />
      </Grid>

      <Grid md={3}>
        <Card>
          <GridBotSettings bot={bot} symbol={symbol} />
        </Card>
      </Grid>
    </Grid>
  );
}
