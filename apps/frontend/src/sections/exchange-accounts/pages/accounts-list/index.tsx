import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import React, { FC, useState } from "react";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { trpc } from "src/lib/trpc";
import { TExchangeAccount } from "src/types/trpc";
import { AccountsListTable } from "src/sections/exchange-accounts/pages/accounts-list/components/AccountsListTable/AccountsListTable";
import { CreateAccountDialog } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountDialog/CreateAccountDialog";
import { UpdateAccountDialog } from "src/sections/exchange-accounts/pages/accounts-list/components/UpdateAccountDialog/UpdateAccountDialog";

const componentName = "ExchangeAccountsPage";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type ExchangeAccountsPageProps = {
  className?: string;
};

export const ExchangeAccountsPage: FC<ExchangeAccountsPageProps> = (props) => {
  const { className } = props;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<TExchangeAccount | null>(null);

  const { isLoading, isError, error, data, refetch } = useQuery(
    ["exchangeAccounts"],
    async () => trpc.exchangeAccount.list.query(),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <Root
      className={clsx(classes.root, className)}
      ContainerProps={{
        maxWidth: "xl",
        sx: {
          ml: 0, // align to left
        },
      }}
    >
      <Card>
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
      </Card>
    </Root>
  );
};
