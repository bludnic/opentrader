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
        <TableCell>Date</TableCell>
        <TableCell align="right">Net Profit</TableCell>
        <TableCell align="right">Gross Profit</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
