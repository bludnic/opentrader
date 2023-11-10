import React, { FC } from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import ListDivider from "@mui/joy/ListDivider";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import { calcTotalProfitFromSmartTrades } from "src/utils/grid-bot/calcTotalProfitFromSmartTrades";
import { ProfitItem } from "./ProfitItem";
import { Profit } from "./Profit";
import { TCompletedSmartTrade } from "src/types/trpc";

type ProfitsCardProps = {
  smartTrades: TCompletedSmartTrade[];
  baseCurrency: string;
  quoteCurrency: string;
};

export const ProfitsCard: FC<ProfitsCardProps> = ({
  smartTrades,
  baseCurrency,
  quoteCurrency,
}) => {
  const totalProfit = calcTotalProfitFromSmartTrades(smartTrades);

  return (
    <Card
      sx={{
        maxHeight: 500,
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography level="h3" fontSize="xl2" fontWeight="xl">
          Profits
        </Typography>

        <Tooltip title="Total profit">
          <Typography level="h3" fontSize="xl2" fontWeight="xl">
            <Profit profit={totalProfit} currency={quoteCurrency} size="lg" />
          </Typography>
        </Tooltip>
      </Box>

      {smartTrades.length > 0 ? (
        <CardContent sx={{ overflowY: "scroll" }}>
          <List size="sm">
            {smartTrades.map((smartTrade, i) => (
              <React.Fragment key={smartTrade.id}>
                <ProfitItem smartTrade={smartTrade} key={smartTrade.id} />
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
