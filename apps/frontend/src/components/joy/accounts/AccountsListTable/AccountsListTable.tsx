"use client";

import React, { FC, useState } from "react";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

import { TExchangeAccount } from "src/types/trpc";
import { AccountsListTableRow } from "./AccountsListTableRow";
import { AccountsListTableToolbar } from "./AccountsListTableToolbar";
import { AccountsListTableHead } from "./AccountsListTableHead";

type AccountsListTableProps = {
  accounts: TExchangeAccount[];
  onCreateAccountClick: () => void;
  onEditAccountClick: (account: TExchangeAccount) => void;
};

export const AccountsListTable: FC<AccountsListTableProps> = (props) => {
  const { accounts, onCreateAccountClick, onEditAccountClick } =
    props;

  const [selected, setSelected] = useState<readonly number[]>([]);

  const isSelected = (accountId: number) => selected.indexOf(accountId) !== -1;

  const handleClick = (event: React.MouseEvent<unknown>, accountId: number) => {
    const selectedIndex = selected.indexOf(accountId);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, accountId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
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
    <Sheet
      variant="outlined"
      sx={{ maxWidth: "1200px", boxShadow: "sm", borderRadius: "sm" }}
    >
      <AccountsListTableToolbar
        title="Exchange Accounts"
        numSelected={selected.length}
        onCreateAccountClick={onCreateAccountClick}
        onEditAccountClick={() => {
          const account = accounts.find(
            (account) => account.id === selected[0],
          );

          if (account) {
            onEditAccountClick(account);
          } else {
            console.log(`AccountsListTable: Account ${selected[0]} not found`);
          }
        }}
      />

      <Table
        sx={{
          "--TableCell-headBackground": "transparent",
          "--TableCell-selectedBackground": (theme) =>
            theme.vars.palette.success.softBg,
          "& thead th:nth-child(1)": {
            width: "40px",
          },
          "& thead th:nth-child(2)": {
            width: "40px",
          },
          "& thead th:nth-child(3)": {
            width: "360px",
          },
          "& thead th:nth-child(4)": {
            // width: "100%",
          },
          "& tr > *:nth-child(n+5)": { textAlign: "right" },
        }}
      >
        <AccountsListTableHead
          onSelectAllClick={handleSelectAllClick}
          rowCount={accounts.length}
          numSelected={selected.length}
        />

        <tbody>
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
        </tbody>
      </Table>
    </Sheet>
  );
};
