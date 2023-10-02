import { alpha, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import Big from "big.js";
import clsx from "clsx";
import React, { FC } from "react";
import { TSmartTrade } from "src/types/trpc/smart-trade";

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
  smartTrade: TSmartTrade;
};

export const BacktestingTableItem: FC<BacktestingTableItemProps> = (props) => {
  const { className, smartTrade } = props;

  if (
    smartTrade.entryType === "Ladder" ||
    smartTrade.takeProfitType === "Ladder"
  ) {
    throw new Error("Unsupported order type Ladder");
  }

  return (
    <StyledTableRow className={clsx(classes.root, className)}>
      <TableCell component="th" scope="row">
        {smartTrade.id}
      </TableCell>

      <TableCell component="th" scope="row">
        {new Date(smartTrade.takeProfitOrder.updatedAt).toISOString()}
      </TableCell>

      <TableCell component="th" scope="row">
        {smartTrade.entryOrder.quantity}
      </TableCell>

      <TableCell component="th" scope="row">
        {smartTrade.entryOrder.price}
      </TableCell>

      <TableCell component="th" align="right">
        {smartTrade.takeProfitOrder.price}
      </TableCell>

      <TableCell component="th" align="right">
        {new Big(smartTrade.takeProfitOrder.price || 0)
          .minus(smartTrade.entryOrder.price || 0)
          .toFixed(2)
          .toString()}
      </TableCell>
    </StyledTableRow>
  );
};
