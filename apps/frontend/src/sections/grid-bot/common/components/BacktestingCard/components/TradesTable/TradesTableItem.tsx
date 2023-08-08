import { OrderStatusEnum } from "@bifrost/types";
import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/system/colorManipulator";
import Big from "big.js";
import clsx from "clsx";
import React, { FC } from "react";
import { BacktestingTradeDto } from "src/lib/bifrost/rtkApi";
import { formatDateTime } from "src/utils/date/formatDateTime";

const componentName = "TradesTableItem";
const classes = {
  root: `${componentName}-root`,
  rowSell: `${componentName}-row-sell`,
  rowBuy: `${componentName}-row-buy`,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`&.${classes.rowSell}`]: {
    backgroundColor: alpha(theme.palette.success.light, 0.5),
  },
  [`&.${classes.rowBuy}`]: {
    backgroundColor: alpha(theme.palette.grey[700], 0.5),
  },
}));

type TradesTableItemProps = {
  className?: string;
  trade: BacktestingTradeDto;
};

export const TradesTableItem: FC<TradesTableItemProps> = (props) => {
  const { className, trade } = props;
  const { smartTrade } = trade;

  const profit = new Big(smartTrade.sellOrder.price)
    .minus(smartTrade.buyOrder.price)
    .times(trade.quantity)
    .toFixed(2)
    .toString();

  return (
    <StyledTableRow
      className={clsx(classes.root, className, {
        [classes.rowBuy]: trade.side === "buy",
        [classes.rowSell]: trade.side === "sell",
      })}
    >
      <TableCell component="th" scope="row">
        {formatDateTime(trade.time)}
      </TableCell>

      <TableCell component="th" scope="row" align="right">
        {trade.quantity}
      </TableCell>

      <TableCell component="th" scope="row" align="right">
        {trade.price}
      </TableCell>

      <TableCell component="th" align="right">
        {trade.side === "sell" ? profit : null}
      </TableCell>

      <TableCell component="th" align="right">
        {smartTrade.id}
      </TableCell>
    </StyledTableRow>
  );
};
