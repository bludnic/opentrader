import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC } from "react";
import { CompletedDealWithProfitDto, GridBotDto } from "src/lib/bifrost/client";

const componentName = "CompletedDealTableItem";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedDealTableItemProps = {
  className?: string;
  bot: GridBotDto;
  deal: CompletedDealWithProfitDto;
};

export const CompletedDealTableItem: FC<CompletedDealTableItemProps> = (
  props
) => {
  const { className, deal, bot } = props;

  return (
    <StyledTableRow className={clsx(classes.root, className, {})}>
      <TableCell component="th" scope="row">
        {new Date(deal.createdAt).toLocaleDateString()}{" "}
        {new Date(deal.createdAt).toLocaleTimeString()}
      </TableCell>

      <TableCell align="right">
        {deal.netProfit} {bot.quoteCurrency}
      </TableCell>

      <TableCell align="right">
        {deal.grossProfit} {bot.quoteCurrency}
      </TableCell>
    </StyledTableRow>
  );
};
