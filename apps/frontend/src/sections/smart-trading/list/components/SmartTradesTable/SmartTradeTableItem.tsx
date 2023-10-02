import { alpha, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import Big from "big.js";
import clsx from "clsx";
import React, { FC } from "react";
import { TSmartTrade } from "src/types/trpc/smart-trade";
import { formatDateISO } from "src/utils/date/formatDateISO";
import { formatDateTime } from "src/utils/date/formatDateTime";

const componentName = "SmartTradeTableItem";
const classes = {
  root: `${componentName}-root`,
  statusMap: `${componentName}__status-map`,
  statusMapFilled: `${componentName}__status-map--filled`,
  positionBuying: `${componentName}__position--buying`,
  positionSelling: `${componentName}__position--selling`,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.positionBuying}`]: {
    color: theme.palette.success.main,
  },
  [`& .${classes.positionSelling}`]: {
    color: theme.palette.error.main,
  },

  [`& .${classes.statusMap}`]: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },

  [`& .${classes.statusMapFilled}`]: {
    fontWeight: 500,
  },

  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type SmartTradeTableItemProps = {
  className?: string;
  smartTrade: TSmartTrade;
};

export const SmartTradeTableItem: FC<SmartTradeTableItemProps> = (props) => {
  const { className, smartTrade } = props;

  if (smartTrade.entryType === "Ladder") {
    return (
      <StyledTableRow className={clsx(classes.root, className)}>
        <TableCell component="td" colSpan={9}>
          Ladder entryType unsupported (ID: {smartTrade.id})
        </TableCell>
      </StyledTableRow>
    );
  }

  if (smartTrade.takeProfitType === "Ladder") {
    return (
      <StyledTableRow className={clsx(classes.root, className)}>
        <TableCell component="td" colSpan={9}>
          Ladder takeProfitType unsupported (ID: {smartTrade.id})
        </TableCell>
      </StyledTableRow>
    );
  }

  const currencyPair = `${smartTrade.baseCurrency}/${smartTrade.quoteCurrency}`;
  const isPositionOpen = smartTrade.entryOrder.status === "Filled";
  const amount = new Big(smartTrade.entryOrder.price || 0)
    .times(smartTrade.entryOrder.quantity)
    .toFixed(2)
    .toString();
  const createdAt = formatDateTime(new Date(smartTrade.createdAt).getTime());

  return (
    <StyledTableRow className={clsx(classes.root, className)}>
      <TableCell component="td" scope="row">
        {smartTrade.id}
      </TableCell>

      <TableCell component="td" scope="row">
        {currencyPair}
      </TableCell>

      <TableCell
        component="td"
        scope="row"
        className={clsx({
          [classes.positionBuying]: !isPositionOpen,
          [classes.positionSelling]: isPositionOpen,
        })}
      >
        <div>{isPositionOpen ? "Selling" : "Buying"}</div>
        <div>
          <span
            className={clsx(classes.statusMap, {
              [classes.statusMapFilled]:
                smartTrade.entryOrder.status === "Filled",
            })}
          >
            {smartTrade.entryOrder.status}
          </span>
          <span className={classes.statusMap}> / </span>
          <span
            className={clsx(classes.statusMap, {
              [classes.statusMapFilled]:
                smartTrade.takeProfitOrder.status === "Filled",
            })}
          >
            {smartTrade.takeProfitOrder.status}
          </span>
        </div>
      </TableCell>

      <TableCell component="td" scope="row">
        {smartTrade.entryOrder.type === "Limit"
          ? smartTrade.entryOrder.price
          : "--"}
      </TableCell>

      <TableCell component="td" scope="row">
        {smartTrade.entryOrder.quantity}
      </TableCell>

      <TableCell component="td" scope="row">
        --
      </TableCell>

      <TableCell component="td" scope="row">
        {amount} {smartTrade.quoteCurrency}
      </TableCell>

      <TableCell component="td" scope="row">
        {createdAt}
      </TableCell>

      <TableCell component="td" scope="row">
        {smartTrade.botId}
      </TableCell>

      <TableCell component="td" scope="row">
        {smartTrade.ref}
      </TableCell>
    </StyledTableRow>
  );
};
