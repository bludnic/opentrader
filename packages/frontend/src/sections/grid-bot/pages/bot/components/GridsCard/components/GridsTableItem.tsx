import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/system/colorManipulator";
import clsx from "clsx";
import React, { FC } from "react";
import {
  DealSellFilledEntityStatusEnum,
  DealSellPlacedEntityStatusEnum,
  GridBotDto,
} from "src/lib/bifrost/client";

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
  deal: GridBotDto["deals"][number];
  gridNumber: number;
};

export const GridsTableItem: FC<GridsTableItemProps> = (props) => {
  const { className, deal, gridNumber } = props;

  const orderPrice =
    deal.status === DealSellPlacedEntityStatusEnum.SellPlaced
      ? deal.sellOrder.price
      : deal.buyOrder.price;

  const orderSide: "Buy" | "Sell" =
    deal.status === DealSellPlacedEntityStatusEnum.SellPlaced ||
    deal.status === DealSellFilledEntityStatusEnum.SellFilled
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
        {deal.status}
      </TableCell>

      <TableCell align="right">{orderPrice}</TableCell>
      <TableCell align="right">{orderSide}</TableCell>
    </StyledTableRow>
  );
};
