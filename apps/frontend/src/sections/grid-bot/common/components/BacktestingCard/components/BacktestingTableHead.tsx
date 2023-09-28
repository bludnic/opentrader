import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { TableCell, TableHead, TableRow } from "@mui/material";

const componentName = "BacktestingTableHead";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BacktestingTableHeadProps = {
  className?: string;
  baseCurrency: string;
  quoteCurrency: string;
};

export const BacktestingTableHead: FC<BacktestingTableHeadProps> = (props) => {
  const { className, baseCurrency, quoteCurrency } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell>ST</TableCell>
        <TableCell>Time</TableCell>
        <TableCell align="right">Qty ({baseCurrency})</TableCell>
        <TableCell align="right">Buy price ({quoteCurrency})</TableCell>
        <TableCell align="right">Sell price ({quoteCurrency})</TableCell>
        <TableCell align="right">Profit ({quoteCurrency})</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
