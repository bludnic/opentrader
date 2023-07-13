import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { ThreeCommasAccountDto } from "src/lib/bifrost/client";
import { useLazyGetAccountsQuery } from "src/sections/3commas-accounts/common/store/api";
import { AccountsListTable } from "./components/AccountsListTable/AccountsListTable";
import { CreateAccountDialog } from "./components/CreateAccountDialog/CreateAccountDialog";
import { UpdateAccountDialog } from "./components/UpdateAccountDialog/UpdateAccountDialog";

const componentName = "ThreeCommasAccountPage";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type ThreeCommasAccountPageProps = {
  className?: string;
};

export const ThreeCommasAccountPage: FC<ThreeCommasAccountPageProps> = (
  props
) => {
  const { className } = props;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<ThreeCommasAccountDto | null>(null);

  const [fetchAccounts, { data }] = useLazyGetAccountsQuery();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const accounts = data ? data.accounts : [];

  const handleRefetch = () => {
    fetchAccounts();
  };

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
          accounts={accounts}
          onCreateAccountClick={() => setCreateDialogOpen(true)}
          onEditAccountClick={(account) => {
            setSelectedAccount(account);
            setUpdateDialogOpen(true);
          }}
        />

        <CreateAccountDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreated={() => handleRefetch()}
        />

        {selectedAccount ? (
          <UpdateAccountDialog
            account={selectedAccount}
            open={updateDialogOpen}
            onClose={() => setUpdateDialogOpen(false)}
            onCreated={() => handleRefetch()}
          />
        ) : null}
      </Card>
    </Root>
  );
};
