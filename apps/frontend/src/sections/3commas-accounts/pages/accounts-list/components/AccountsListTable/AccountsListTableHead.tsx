import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Checkbox } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";

const componentName = "ThreeCommasAccountsListTableHead";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type AccountsListTableHeadProps = {
  className?: string;
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AccountsListTableHead: FC<AccountsListTableHeadProps> = (
  props
) => {
  const { className, onSelectAllClick, numSelected, rowCount } = props;

  return (
    <StyledTableHead className={clsx(classes.root, className)}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>

        <TableCell>ID</TableCell>

        <TableCell>Name</TableCell>

        <TableCell>Created</TableCell>

        <TableCell>Environment</TableCell>
      </TableRow>
    </StyledTableHead>
  );
};
