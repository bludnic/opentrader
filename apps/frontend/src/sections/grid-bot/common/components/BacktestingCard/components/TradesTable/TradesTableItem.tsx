import { alpha, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import Big from "big.js";
import clsx from "clsx";
import React, { FC } from "react";
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
  transaction: any; // @todo type from tRPC
};

export const TradesTableItem: FC<TradesTableItemProps> = (props) => {
  const { className, transaction } = props;

  const profit = new Big(transaction.sell?.price || 0)
    .minus(transaction.buy.price)
    .times(transaction.quantity)
    .toFixed(2)
    .toString();

  const date = transaction.side === "sell" && transaction.sell
    ? formatDateTime(transaction.sell.updateAt)
    : formatDateTime(transaction.buy.updateAt)

  return (
    <StyledTableRow
      className={clsx(classes.root, className, {
        [classes.rowBuy]: transaction.side === "buy",
        [classes.rowSell]: transaction.side === "sell",
      })}
    >
      <TableCell component="th" scope="row">
        {date}
      </TableCell>

      <TableCell component="th" scope="row" align="right">
        {transaction.quantity}
      </TableCell>

      <TableCell component="th" scope="row" align="right">
        {transaction.buy.price}
      </TableCell>

      <TableCell component="th" scope="row" align="right">
        {transaction.side === 'sell' && transaction.sell ? transaction.sell.price : 'N/A'}
      </TableCell>

      <TableCell component="th" align="right">
        {transaction.side === "sell" ? profit : null}
      </TableCell>

      <TableCell component="th" align="right">
        {transaction.smartTradeId}
      </TableCell>
    </StyledTableRow>
  );
};
