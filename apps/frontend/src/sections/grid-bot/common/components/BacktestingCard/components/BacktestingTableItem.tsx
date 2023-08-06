import { OrderStatusEnum } from "@bifrost/types";
import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/system/colorManipulator";
import Big from "big.js";
import clsx from "clsx";
import React, { FC } from "react";
import { SmartTradeDto, TradeDto } from "src/lib/bifrost/rtkApi";

const componentName = "BacktestingTableItem";
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

type BacktestingTableItemProps = {
  className?: string;
  smartTrade: SmartTradeDto;
};

export const BacktestingTableItem: FC<BacktestingTableItemProps> = (props) => {
  const { className, smartTrade } = props;

  return (
    <StyledTableRow
      className={clsx(classes.root, className)}
    >
      <TableCell component="th" scope="row">
        {smartTrade.id}
      </TableCell>

      <TableCell component="th" scope="row">
        {new Date(smartTrade.sellOrder.updatedAt).toISOString()}
      </TableCell>

      <TableCell component="th" scope="row">
        {smartTrade.quantity}
      </TableCell>

      <TableCell component="th" scope="row">
        {smartTrade.buyOrder.price}
      </TableCell>

      <TableCell component="th" align="right">
        {smartTrade.sellOrder.price}
      </TableCell>


      <TableCell component="th" align="right">
        {new Big(smartTrade.sellOrder.price).minus(smartTrade.buyOrder.price).toFixed(2).toString()}
      </TableCell>
    </StyledTableRow>
  );
};
