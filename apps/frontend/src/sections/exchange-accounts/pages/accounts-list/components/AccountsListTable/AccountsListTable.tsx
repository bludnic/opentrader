import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { styled } from "@mui/material/styles";
import React, { FC, useState } from "react";
import clsx from "clsx";
import { ExchangeAccountDto } from 'src/lib/bifrost/rtkApi';
import { AccountsListTableRow } from "./AccountsListTableRow";
import { AccountsListTableToolbar } from "./AccountsListTableToolbar";
import { AccountsListTableHead } from "./AccountsListTableHead";

const componentName = "AccountsListTable";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Box)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type AccountsListTableProps = {
  className?: string;
  accounts: ExchangeAccountDto[];
  onCreateAccountClick: () => void;
  onEditAccountClick: (account: ExchangeAccountDto) => void;
};

export const AccountsListTable: FC<AccountsListTableProps> = (props) => {
  const {
    className,
    accounts,
    onCreateAccountClick,
    onEditAccountClick,
  } = props;

  const [selected, setSelected] = useState<readonly string[]>([]);

  const isSelected = (accountId: ExchangeAccountDto["id"]) =>
    selected.indexOf(accountId) !== -1;

  const handleClick = (
    event: React.MouseEvent<unknown>,
    accountId: ExchangeAccountDto["id"]
  ) => {
    const selectedIndex = selected.indexOf(accountId);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, accountId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = accounts.map((account) => account.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  return (
    <Root className={clsx(classes.root, className)}>
      <AccountsListTableToolbar
        title="Exchange Accounts"
        numSelected={selected.length}
        onCreateAccountClick={onCreateAccountClick}
        onEditAccountClick={() => {
          const account = accounts.find(
            (account) => account.id === selected[0]
          );

          if (account) {
            onEditAccountClick(account);
          } else {
            console.log(`AccountsListTable: Account ${selected[0]} not found`);
          }
        }}
      />

      <Divider />

      <TableContainer>
        <Table>
          <AccountsListTableHead
            onSelectAllClick={handleSelectAllClick}
            rowCount={accounts.length}
            numSelected={selected.length}
          />

          <TableBody>
            {accounts.map((account) => {
              const isItemSelected = isSelected(account.id);

              return (
                <AccountsListTableRow
                  key={account.id}
                  account={account}
                  selected={isItemSelected}
                  onClick={(e, accountId) => handleClick(e, accountId)}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
};
