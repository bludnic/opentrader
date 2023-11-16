"use client";

import Box from "@mui/joy/Box";
import React, { useState } from "react";
import { AccountsListTable } from "src/components/accounts/AccountsListTable";
import { CreateAccountDialog } from "src/components/accounts/CreateAccountDialog/CreateAccountDialog";
import { UpdateAccountDialog } from "src/components/accounts/UpdateAccountDialog/UpdateAccountDialog";
import { tClient } from "src/lib/trpc/client";
import { TExchangeAccount } from "src/types/trpc";

export default function Page() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<TExchangeAccount | null>(null);

  const { isLoading, isError, error, data, refetch } =
    tClient.exchangeAccount.list.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <Box>
      <AccountsListTable
        accounts={data}
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
