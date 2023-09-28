import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC } from "react";
import { TCompletedSmartTrade, TGridBot } from "src/types/trpc";

const componentName = "CompletedSmartTradeItem";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedSmartTradeItemProps = {
  className?: string;
  bot: TGridBot;
  smartTrade: TCompletedSmartTrade;
};

export const CompletedSmartTradeItem: FC<CompletedSmartTradeItemProps> = (
  props,
) => {
  const { className, smartTrade, bot } = props;

  const buyOrder = smartTrade.orders.find((order) => order.side === "Buy");
  const sellOrder = smartTrade.orders.find((order) => order.side === "Sell");

  if (!buyOrder) {
    return <div>Error: Buy order not found</div>;
  }

  if (!sellOrder) {
    return <div>Error: Sell order not found</div>;
  }

  return (
    <StyledTableRow className={clsx(classes.root, className, {})}>
      <TableCell component="th" scope="row">
        {new Date(buyOrder.createdAt).toLocaleDateString()}{" "}
        {new Date(buyOrder.createdAt).toLocaleTimeString()}
      </TableCell>

      <TableCell component="th" scope="row">
        {new Date(sellOrder.createdAt).toLocaleDateString()}{" "}
        {new Date(sellOrder.createdAt).toLocaleTimeString()}
      </TableCell>

      <TableCell align="right">{buyOrder.quantity}</TableCell>

      <TableCell align="right">
        {buyOrder.price} {bot.quoteCurrency}
      </TableCell>

      <TableCell align="right">
        {sellOrder.price} {bot.quoteCurrency}
      </TableCell>
    </StyledTableRow>
  );
};
