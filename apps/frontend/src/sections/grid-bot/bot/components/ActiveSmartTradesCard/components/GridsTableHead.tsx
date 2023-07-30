import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { TableCell, TableHead, TableRow } from "@mui/material";

const componentName = "GridsTableHead";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type GridsTableHeadProps = {
  className?: string;
  baseCurrency: string;
  quoteCurrency: string;
};

export const GridsTableHead: FC<GridsTableHeadProps> = (props) => {
  const { className, baseCurrency, quoteCurrency } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell>Grid №</TableCell>
        <TableCell>[Buy / Sell] order status</TableCell>
        <TableCell align="right">Qty ({baseCurrency})</TableCell>
        <TableCell align="right">Buy ({quoteCurrency})</TableCell>
        <TableCell align="right">Sell ({quoteCurrency})</TableCell>
        <TableCell align="right">Side</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
