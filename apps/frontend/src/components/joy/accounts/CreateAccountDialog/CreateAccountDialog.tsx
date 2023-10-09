import { useSnackbar } from "notistack";
import React, { FC } from "react";
import { CreateAccountForm } from "../CreateAccountForm/CreateAccountForm";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";

type NewAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export const CreateAccountDialog: FC<NewAccountDialogProps> = (props) => {
  const { open, onClose, onCreated } = props;
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog maxWidth={500}>
        <DialogTitle>New exchange account</DialogTitle>

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
      </ModalDialog>
    </Modal>
  );
};
