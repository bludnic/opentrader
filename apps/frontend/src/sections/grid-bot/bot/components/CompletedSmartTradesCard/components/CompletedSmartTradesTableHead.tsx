import { TableCell, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";

const componentName = "CompletedSmartTradesTableHead";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedSmartTradesTableHeadProps = {
  className?: string;
};

export const CompletedSmartTradesTableHead: FC<
  CompletedSmartTradesTableHeadProps
> = (props) => {
  const { className } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell>Buy Date</TableCell>
        <TableCell>Sell Date</TableCell>
        <TableCell align="right">Quantity</TableCell>
        <TableCell align="right">Buy Price</TableCell>
        <TableCell align="right">Sell Price</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
