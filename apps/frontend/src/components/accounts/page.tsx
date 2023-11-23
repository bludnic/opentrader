"use client";

import Box from "@mui/joy/Box";
import React, { useState } from "react";
import { AccountsListTable } from "src/components/accounts/AccountsListTable";
import { CreateAccountDialog } from "src/components/accounts/CreateAccountDialog/CreateAccountDialog";
import { UpdateAccountDialog } from "src/components/accounts/UpdateAccountDialog/UpdateAccountDialog";
import { tClient } from "src/lib/trpc/client";
import { TExchangeAccount } from "src/types/trpc";

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
        onCreateAccountClick={() => setCreateDialogOpen(true)}
        onEditAccountClick={(account) => {
          setSelectedAccount(account);
          setUpdateDialogOpen(true);
        }}
      />

      <CreateAccountDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={refetch}
      />

      {selectedAccount ? (
        <UpdateAccountDialog
          account={selectedAccount}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onCreated={refetch}
        />
      ) : null}
    </Box>
  );
}
