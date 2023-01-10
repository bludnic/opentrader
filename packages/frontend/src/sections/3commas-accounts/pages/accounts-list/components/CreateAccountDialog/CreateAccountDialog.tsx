import { Card, CardContent, Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import React, { FC } from "react";
import clsx from "clsx";
import { CreateAccountForm } from 'src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/CreateAccountForm';

const componentName = "ThreeCommasCreateAccountDialog";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Dialog)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type NewAccountDialogProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export const CreateAccountDialog: FC<NewAccountDialogProps> = (props) => {
  const { className, open, onClose, onCreated } = props;
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Root
      className={clsx(classes.root, className)}
      open={open}
      onClose={onClose}
    >
      <Card>
        <CardContent>
          <Typography variant="h6">New account</Typography>
        </CardContent>

        <Divider />

        <CardContent>
          <CreateAccountForm
            onCreated={() => {
              onCreated();
              onClose();

              enqueueSnackbar("Account created", {
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
