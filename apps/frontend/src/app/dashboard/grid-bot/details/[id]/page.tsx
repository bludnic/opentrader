import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { composeSymbolId } from "@opentrader/tools";
import { ExchangeCode } from "@opentrader/types";
import React from "react";
import { BotSettings } from "src/components/grid-bot/bot-details/BotSettings";
import { RunBotTemplateButton } from "src/components/grid-bot/bot-details/RunBotTemplateButton";
import { CronPlacePendingOrderButton } from "src/components/grid-bot/bot-details/CronPlacePendingOrderButton";
import { GridDetailChart } from "src/components/grid-bot/bot-details/GridDetailChart";
import { SmartTradesTable } from "src/components/grid-bot/bot-details/SmartTradesTable";
import { StartStopBotButton } from "src/components/grid-bot/bot-details/StartStopBotButton";
import { tServer } from "src/lib/trpc/server";
import Grid from "@mui/joy/Grid";
import Box from "@mui/joy/Box";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const botId = Number(params.id);
  const bot = await tServer.gridBot.getOne(botId);

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

  const activeSmartTrades = await tServer.gridBot.activeSmartTrades({
    botId,
  });

  const pendingSmartTrades = await tServer.gridBot.pendingSmartTrades({
    botId,
  });

  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <GridDetailChart
          symbol={symbol}
          exchangeAccount={exchangeAccount}
          gridLines={bot.settings.gridLines}
        />
      </Grid>

      <Grid md={3}>
        <Card>
          <Box display="flex" justifyContent="space-between">
            <Typography level="h3" fontSize="xl2" fontWeight="xl">
              {bot.name}
            </Typography>

            <Typography
              level="h3"
              fontSize="xl2"
              fontWeight="xl"
              color="neutral"
            >
              #{bot.id}
            </Typography>
          </Box>

          <BotSettings bot={bot} />

          <StartStopBotButton bot={bot} />

          <RunBotTemplateButton bot={bot} />

          <CronPlacePendingOrderButton
            bot={bot}
            smartTrades={pendingSmartTrades}
          />
        </Card>
      </Grid>

      <Grid md={9}>
        <SmartTradesTable smartTrades={activeSmartTrades} />
      </Grid>
    </Grid>
  );
}
