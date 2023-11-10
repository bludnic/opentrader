"use client";

import { FC } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import Typography from "@mui/joy/Typography";
import { getTRPCErrorValue } from "src/ui/errors/utils/getTrpcErrorValue";
import { useTRPCErrorModal } from "./useTRPCErrorModal";

export const TRPCApiErrorModal: FC = () => {
  const { error, close } = useTRPCErrorModal();

  const opened = !!error;

  if (!opened) {
    return null;
  }

  const path = getTRPCErrorValue(error.data, "path");
  const stacktrace = getTRPCErrorValue(error.data, "stack");
  const httpStatus = getTRPCErrorValue(error.data, "httpStatus");
  const code = getTRPCErrorValue(error.data, "code");

  return (
    <Modal open={opened} onClose={close}>
      <ModalDialog color="danger" variant="plain" maxWidth={1400}>
        <ModalClose />

        <Typography level="h2">{code}</Typography>
        <Typography>{error.message}</Typography>

        {code ? (
          <Typography>
            <strong>Code:</strong> {code}
          </Typography>
        ) : null}

        {path ? (
          <Typography>
            <strong>Path:</strong> {path}
          </Typography>
        ) : null}

        {httpStatus ? (
          <Typography>
            <strong>HTTP Status:</strong> {httpStatus}
          </Typography>
        ) : null}

        <DialogContent>
          {stacktrace ? <pre>{stacktrace}</pre> : null}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};
