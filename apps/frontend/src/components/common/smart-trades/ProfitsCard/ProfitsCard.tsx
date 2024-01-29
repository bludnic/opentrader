"use client";

import type { FC } from "react";
import React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import ListDivider from "@mui/joy/ListDivider";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import { tClient } from "src/lib/trpc/client";
import { calcTotalProfitFromSmartTrades } from "src/utils/smart-trades/calcTotalProfitFromSmartTrades";
import { ProfitItem } from "./ProfitItem";
import { Profit } from "./Profit";

type ProfitsCardProps = {
  botId: number;
};

export const ProfitsCard: FC<ProfitsCardProps> = ({ botId }) => {
  const [bot] = tClient.bot.getOne.useSuspenseQuery(botId);
  const [smartTrades] = tClient.bot.completedSmartTrades.useSuspenseQuery({
    botId,
  });

  const totalProfit = calcTotalProfitFromSmartTrades(smartTrades);

  return (
    <Card
      sx={{
        maxHeight: 500,
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize="xl2" fontWeight="xl" level="h3">
          Profits
        </Typography>

        {smartTrades.length > 0 ? (
          <Tooltip title="Total profit">
            <Typography fontSize="xl2" fontWeight="xl" level="h3">
              <Profit
                currency={bot.quoteCurrency}
                profit={totalProfit}
                size="lg"
              />
            </Typography>
          </Tooltip>
        ) : null}
      </Box>

      {smartTrades.length > 0 ? (
        <CardContent sx={{ overflowY: "scroll" }}>
          <List size="sm">
            {smartTrades.map((smartTrade, i) => (
              <React.Fragment key={smartTrade.id}>
                <ProfitItem key={smartTrade.id} smartTrade={smartTrade} />
                {i < smartTrades.length - 1 ? <ListDivider /> : null}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      ) : (
        <CardContent>
          <Typography>No profits yet</Typography>
        </CardContent>
      )}
    </Card>
  );
};
