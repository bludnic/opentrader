import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import React, { FC } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { TExchangeAccount } from "src/types/trpc";
import { formatDateTime } from "src/utils/date/formatDateTime";

const componentName = "AccountsListTableRow";
const classes = {
  root: `${componentName}-root`,
};
const StyledRow = styled(TableRow)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type AccountsListTableRowProps = {
  account: TExchangeAccount;
  className?: string;
  selected: boolean;
  onClick: (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    accountId: number,
  ) => void;
};

export const AccountsListTableRow: FC<AccountsListTableRowProps> = (props) => {
  const { className, account, selected, onClick } = props;

  return (
    <StyledRow className={clsx(classes.root, className)}>
      <TableCell padding="checkbox" onClick={(e) => onClick(e, account.id)}>
        <Checkbox color="primary" checked={selected} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        {account.exchangeCode}
      </TableCell>

      <TableCell>{account.id}</TableCell>

      <TableCell>{account.name}</TableCell>

      <TableCell>
        <pre>{JSON.stringify(account.credentials, null, 2)}</pre>
      </TableCell>

      <TableCell>{formatDateTime(account.createdAt.getTime())}</TableCell>

      <TableCell>
        <Chip
          label={account.credentials.isDemoAccount ? "Demo" : "Real"}
          color={account.credentials.isDemoAccount ? "default" : "primary"}
        />
      </TableCell>
    </StyledRow>
  );
};
