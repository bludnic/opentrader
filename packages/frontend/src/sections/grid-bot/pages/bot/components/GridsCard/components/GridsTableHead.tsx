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
};

export const GridsTableHead: FC<GridsTableHeadProps> = (props) => {
  const { className } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell>Grid №</TableCell>
        <TableCell>Deal Status</TableCell>
        <TableCell align="right">Price</TableCell>
        <TableCell align="right">Side</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
