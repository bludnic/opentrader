import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import React, { FC } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import clsx from "clsx";
import { ThreeCommasAccountDto } from "src/lib/bifrost/client";
import { styled } from "@mui/material/styles";

const componentName = "ThreeCommasAccountsListTableRow";
const classes = {
  root: `${componentName}-root`,
};
const StyledRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type AccountsListTableRowProps = {
  account: ThreeCommasAccountDto;
  className?: string;
  selected: boolean;
  onClick: (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    accountId: ThreeCommasAccountDto["id"]
  ) => void;
};

export const AccountsListTableRow: FC<AccountsListTableRowProps> = (props) => {
  const { className, account, selected, onClick } = props;

  return (
    <StyledRow className={clsx(classes.root, className)}>
      <TableCell padding="checkbox" onClick={(e) => onClick(e, account.id)}>
        <Checkbox color="primary" checked={selected} />
      </TableCell>

      <TableCell>{account.id}</TableCell>

      <TableCell>{account.name}</TableCell>

      <TableCell>{account.createdAt}</TableCell>

      <TableCell>
        <Chip
          label={account.credentials.isPaperAccount ? "Paper" : "Real"}
          color={account.credentials.isPaperAccount ? "default" : "primary"}
        />
      </TableCell>
    </StyledRow>
  );
};
