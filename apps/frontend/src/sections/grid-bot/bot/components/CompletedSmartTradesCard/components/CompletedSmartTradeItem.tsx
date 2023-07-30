import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC } from "react";
import { SmartTradeWithProfitDto, GridBotDto } from "src/lib/bifrost/client";

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
  bot: GridBotDto;
  smartTrade: SmartTradeWithProfitDto;
};

export const CompletedSmartTradeItem: FC<CompletedSmartTradeItemProps> = (
  props
) => {
  const { className, smartTrade, bot } = props;

  return (
    <StyledTableRow className={clsx(classes.root, className, {})}>
      <TableCell component="th" scope="row">
        {new Date(smartTrade.createdAt).toLocaleDateString()}{" "}
        {new Date(smartTrade.createdAt).toLocaleTimeString()}
      </TableCell>

      <TableCell align="right">
        {smartTrade.netProfit} {bot.quoteCurrency}
      </TableCell>

      <TableCell align="right">
        {smartTrade.grossProfit} {bot.quoteCurrency}
      </TableCell>
    </StyledTableRow>
  );
};
