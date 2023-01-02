import { TableCell, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";

const componentName = "CompletedDealsTableHead";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedDealsTableHeadProps = {
  className?: string;
};

export const CompletedDealsTableHead: FC<CompletedDealsTableHeadProps> = (
  props
) => {
  const { className } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell align="right">Net Profit</TableCell>
        <TableCell align="right">Gross Profit</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
