import { Card, CardContent, Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import React, { FC } from "react";
import clsx from "clsx";
import { ExchangeAccountDto } from 'src/lib/bifrost/rtkApi';
import { UpdateAccountForm } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/UpdateAccountForm";

const componentName = "UpdateAccountDialog";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Dialog)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type UpdateAccountDialogProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  account: ExchangeAccountDto;
};

export const UpdateAccountDialog: FC<UpdateAccountDialogProps> = (props) => {
  const { className, open, onClose, onCreated, account } = props;
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Root
      className={clsx(classes.root, className)}
      open={open}
      onClose={onClose}
    >
      <Card>
        <CardContent>
          <Typography variant="h6">Edit exchange account</Typography>
        </CardContent>

        <Divider />

        <CardContent>
          <UpdateAccountForm
            account={account}
            onUpdated={() => {
              onCreated();
              onClose();

              enqueueSnackbar("Account updated", {
                variant: "success",
              });
            }}
            onError={(error) => {
              enqueueSnackbar(JSON.stringify(error), {
                variant: "error",
              });
              console.log(error);
            }}
          />
        </CardContent>
      </Card>
    </Root>
  );
};
