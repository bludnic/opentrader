import { FC } from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import { TCompletedSmartTrade } from "src/types/trpc";
import { calcProfitFromSmartTrade } from "src/utils/grid-bot/calcProfitFromSmartTrade";

type ProfitDetailsProps = {
  smartTrade: TCompletedSmartTrade;
};

export const ProfitDetails: FC<ProfitDetailsProps> = ({ smartTrade }) => {
  const { id, entryOrder, takeProfitOrder } = smartTrade;

  const { fee } = calcProfitFromSmartTrade(smartTrade);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 320,
        justifyContent: "center",
        p: 1,
      }}
    >
      <Typography fontSize="sm">SmartTrade</Typography>
      <List size="sm">
        <ListItem>
          <ListItemContent>ID</ListItemContent>

          {id}
        </ListItem>

        <ListItem>
          <ListItemContent>Qty</ListItemContent>
          {takeProfitOrder.quantity} {smartTrade.baseCurrency}
        </ListItem>

        <ListItem>
          <ListItemContent>Buy</ListItemContent>
          {entryOrder.filledPrice?.toFixed(2)} {smartTrade.quoteCurrency}
        </ListItem>

        <ListItem>
          <ListItemContent>Sell</ListItemContent>
          {takeProfitOrder.filledPrice?.toFixed(2)} {smartTrade.quoteCurrency}
        </ListItem>

        <ListItem>
          <ListItemContent>Fee</ListItemContent>
          {fee.toFixed(2)} {smartTrade.quoteCurrency}
        </ListItem>
      </List>
    </Box>
  );
};
