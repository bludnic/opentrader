import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { TableCell, TableHead, TableRow } from "@mui/material";

const componentName = "SmartTradesTableHead";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type SmartTradesTableHeadProps = {
  className?: string;
};

export const SmartTradesTableHead: FC<SmartTradesTableHeadProps> = (props) => {
  const { className } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Pair</TableCell>
        <TableCell>Side</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Quantity</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>Created</TableCell>
        <TableCell>Bot</TableCell>
        <TableCell>Ref</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
