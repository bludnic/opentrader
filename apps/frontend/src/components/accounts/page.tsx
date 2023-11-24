"use client";

import Box from "@mui/joy/Box";
import React, { useState } from "react";
import { AccountsListTable } from "src/components/accounts/AccountsListTable";
import { CreateAccountDialog } from "src/components/accounts/CreateAccountDialog/CreateAccountDialog";
import { UpdateAccountDialog } from "src/components/accounts/UpdateAccountDialog/UpdateAccountDialog";
import { tClient } from "src/lib/trpc/client";
import type { TExchangeAccount } from "src/types/trpc";

export default function AccountsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<TExchangeAccount | null>(null);

  const [exchangeAccounts, { refetch }] =
    tClient.exchangeAccount.list.useSuspenseQuery();

  return (
    <Box>
      <AccountsListTable
        accounts={exchangeAccounts}
        onCreateAccountClick={() => {
          setCreateDialogOpen(true);
        }}
        onEditAccountClick={(account) => {
          setSelectedAccount(account);
          setUpdateDialogOpen(true);
        }}
      />

      <CreateAccountDialog
        onClose={() => {
          setCreateDialogOpen(false);
        }}
        onCreated={() => void refetch()}
        open={createDialogOpen}
      />

      {selectedAccount ? (
        <UpdateAccountDialog
          account={selectedAccount}
          onClose={() => {
            setUpdateDialogOpen(false);
          }}
          onCreated={() => void refetch()}
          open={updateDialogOpen}
        />
      ) : null}
    </Box>
  );
}
