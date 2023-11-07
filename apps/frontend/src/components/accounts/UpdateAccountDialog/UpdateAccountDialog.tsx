import { useSnackbar } from "notistack";
import React, { FC } from "react";
import { TExchangeAccount } from "src/types/trpc";
import { UpdateAccountForm } from "../CreateAccountForm/UpdateAccountForm";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";

type UpdateAccountDialogProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  account: TExchangeAccount;
};

export const UpdateAccountDialog: FC<UpdateAccountDialogProps> = (props) => {
  const { className, open, onClose, onCreated, account } = props;
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog maxWidth={500}>
        <DialogTitle>Edit exchange account</DialogTitle>

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
      </ModalDialog>
    </Modal>
  );
};
