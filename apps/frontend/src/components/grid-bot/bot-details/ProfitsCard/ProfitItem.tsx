import type { FC } from "react";
import React from "react";
import Typography from "@mui/joy/Typography";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/joy/Tooltip";
import type { TCompletedSmartTrade } from "src/types/trpc";
import { formatDateTime } from "src/utils/date/formatDateTime";
import { calcProfitFromSmartTrade } from "src/utils/grid-bot/calcProfitFromSmartTrade";
import { ProfitDetails } from "./ProfitDetails";
import { Profit } from "./Profit";

type ProfitItemProps = {
  smartTrade: TCompletedSmartTrade;
};

export const ProfitItem: FC<ProfitItemProps> = ({ smartTrade }) => {
  const { netProfit } = calcProfitFromSmartTrade(smartTrade);

  const { filledAt } = smartTrade.takeProfitOrder;
  const dateLabel = filledAt
    ? formatDateTime(filledAt.getTime())
    : "Missing date";

  return (
    <ListItem>
      <ListItemDecorator>
        <Profit currency={smartTrade.quoteCurrency} profit={netProfit} />
      </ListItemDecorator>

      <ListItemContent />

      <Tooltip title={dateLabel}>
        <Typography>
          {filledAt ? formatDistanceToNow(filledAt) : "Missing date"}
        </Typography>
      </Tooltip>

      <Tooltip title={<ProfitDetails smartTrade={smartTrade} />}>
        <InfoOutlinedIcon />
      </Tooltip>
    </ListItem>
  );
};
