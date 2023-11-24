import type { FC } from "react";
import React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import type { TExchangeAccount } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";
import { UpdateAccountForm } from "../CreateAccountForm/UpdateAccountForm";

type UpdateAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  account: TExchangeAccount;
};

export const UpdateAccountDialog: FC<UpdateAccountDialogProps> = (props) => {
  const { open, onClose, onCreated, account } = props;
  const { showSnackbar } = useSnackbar();

  return (
    <Modal onClose={onClose} open={open}>
      <ModalDialog maxWidth={500}>
        <DialogTitle>Edit exchange account</DialogTitle>

        <UpdateAccountForm
          account={account}
          onError={(error) => {
            showSnackbar(JSON.stringify(error), {
              color: "danger",
            });
            console.log(error);
          }}
          onUpdated={() => {
            onCreated();
            onClose();

            showSnackbar("Account updated");
          }}
        />
      </ModalDialog>
    </Modal>
  );
};
