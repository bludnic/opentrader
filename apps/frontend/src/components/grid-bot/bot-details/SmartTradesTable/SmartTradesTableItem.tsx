import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Tooltip from "@mui/joy/Tooltip";
import Big from "big.js";
import React, { FC } from "react";
import { TActiveSmartTrade } from "src/types/trpc";
import { formatDateTime } from "src/utils/date/formatDateTime";
import { SmartTradeStatus } from "./SmartTradeStatus";
import { ID_COLUMN_MIN_WIDTH } from "./constants";

type SmartTradeTableItemProps = {
  smartTrade: TActiveSmartTrade;
};

export const SmartTradesTableItem: FC<SmartTradeTableItemProps> = ({
  smartTrade,
}) => {
  const isPositionOpen = smartTrade.entryOrder.status === "Filled";
  const amount = new Big(smartTrade.entryOrder.price || 0)
    .times(smartTrade.entryOrder.quantity)
    .toFixed(2)
    .toString();
  const createdAt = formatDateTime(new Date(smartTrade.createdAt).getTime());
  const { entryOrder, takeProfitOrder } = smartTrade;
  const price = isPositionOpen ? takeProfitOrder.price : entryOrder.price;

  return (
    <tr tabIndex={-1}>
      <th
        scope="row"
        style={{
          minWidth: ID_COLUMN_MIN_WIDTH,
          width: "auto",
        }}
      >
        <Tooltip
          title={
            <List size="sm">
              <ListItem>Entry Order ID: {entryOrder.id}:{entryOrder.exchangeOrderId ?? "null"}</ListItem>
              <ListItem>TP Order ID: {takeProfitOrder.id}:{takeProfitOrder.exchangeOrderId}</ListItem>
            </List>
          }
        >
          <div>{smartTrade.id}</div>
        </Tooltip>
      </th>
      <th
        scope="row"
        style={{
          textAlign: "right",
        }}
      >
        {smartTrade.entryOrder.quantity} {smartTrade.baseCurrency}
      </th>
      <th scope="row">
        <Tooltip
          title={`Buy ${smartTrade.entryOrder.price} / Sell ${smartTrade.takeProfitOrder.price}`}
        >
          <span>
            {price} {smartTrade.quoteCurrency}
          </span>
        </Tooltip>
      </th>
      <th scope="row">
        <SmartTradeStatus smartTrade={smartTrade} />
      </th>
      <th scope="row">
        <div>
          <span>{smartTrade.entryOrder.status}</span>
          <span> / </span>
          <span>{smartTrade.takeProfitOrder.status}</span>
        </div>
      </th>
      <th scope="row">
        {" "}
        {amount} {smartTrade.quoteCurrency}
      </th>
      <th scope="row">{createdAt}</th>
      <th scope="row">{smartTrade.ref}</th>
    </tr>
  );
};
