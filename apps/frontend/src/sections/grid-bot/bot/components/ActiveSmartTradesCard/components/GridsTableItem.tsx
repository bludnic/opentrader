import { alpha, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC } from "react";
import { TActiveSmartTrade } from "src/types/trpc";

const componentName = "GridsTableItem";
const classes = {
  root: `${componentName}-root`,
  rowSell: `${componentName}-row-sell`,
  rowBuy: `${componentName}-row-buy`,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`&.${classes.rowSell}`]: {
    backgroundColor: alpha(theme.palette.success.main, 0.5),
  },
  [`&.${classes.rowBuy}`]: {
    backgroundColor: alpha(theme.palette.warning.main, 0.5),
  },
}));

type GridsTableItemProps = {
  className?: string;
  smartTrade: TActiveSmartTrade;
  gridNumber: number;
};

export const GridsTableItem: FC<GridsTableItemProps> = (props) => {
  const { className, smartTrade, gridNumber } = props;

  const buyOrder = smartTrade.orders.find((order) => order.side === "Buy");
  const sellOrder = smartTrade.orders.find((order) => order.side === "Sell");

  if (!buyOrder) {
    return <div>Error: Buy order not found</div>;
  }

  if (!sellOrder) {
    return <div>Error: Sell order not found</div>;
  }

  const orderSide: "Buy" | "Sell" =
    sellOrder.status === "Placed" || sellOrder.status === "Filled"
      ? "Sell"
      : "Buy";

  return (
    <StyledTableRow
      className={clsx(classes.root, className, {
        [classes.rowBuy]: orderSide === "Buy",
        [classes.rowSell]: orderSide === "Sell",
      })}
    >
      <TableCell component="th" scope="row">
        {smartTrade.ref}
      </TableCell>

      <TableCell component="th" scope="row">
        {buyOrder.status} / {sellOrder.status}
      </TableCell>

      <TableCell component="th" align="right">
        {buyOrder.quantity}
      </TableCell>

      <TableCell align="right">{buyOrder.price}</TableCell>
      <TableCell align="right">{sellOrder.price}</TableCell>

      <TableCell align="right">{orderSide}</TableCell>
    </StyledTableRow>
  );
};
