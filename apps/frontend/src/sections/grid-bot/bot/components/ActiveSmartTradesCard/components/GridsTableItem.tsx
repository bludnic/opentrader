import { OrderStatusEnum } from "@bifrost/types";
import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/system/colorManipulator";
import clsx from "clsx";
import React, { FC } from "react";
import { SmartTradeDto } from "src/lib/bifrost/rtkApi";

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
  smartTrade: SmartTradeDto;
  gridNumber: number;
};

export const GridsTableItem: FC<GridsTableItemProps> = (props) => {
  const { className, smartTrade, gridNumber } = props;

  const orderSide: "Buy" | "Sell" =
    smartTrade.sellOrder.status === OrderStatusEnum.Placed ||
    smartTrade.sellOrder.status === OrderStatusEnum.Filled
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
        {gridNumber}
      </TableCell>

      <TableCell component="th" scope="row">
        {smartTrade.buyOrder.status} / {smartTrade.sellOrder.status}
      </TableCell>

      <TableCell component="th" align="right">
        {smartTrade.quantity}
      </TableCell>

      <TableCell align="right">{smartTrade.buyOrder.price}</TableCell>
      <TableCell align="right">{smartTrade.sellOrder.price}</TableCell>

      <TableCell align="right">{orderSide}</TableCell>
    </StyledTableRow>
  );
};
