"use client";

import { useState } from "react";
import type { FC } from "react";
import ModalDialog from "@mui/joy/ModalDialog";
import Modal from "@mui/joy/Modal";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import DialogActions from "@mui/joy/DialogActions";
import Button from "@mui/joy/Button";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useConfirmationDialog } from "./useConfirmationDialog";

export const ConfirmationDialog: FC = () => {
  const {
    open,
    handleClose,
    onConfirm,
    message,
    color,
    variant,
    layout,
    dialogTitle,
    confirmText,
    confirmButtonColor,
    confirmButtonVariant,
    cancelText,
    cancelButtonColor,
    cancelButtonVariant,
  } = useConfirmationDialog();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const maybePromise = onConfirm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- this is safe
    const isPromise = !!(maybePromise as any)?.then;

    if (isPromise) {
      try {
        setLoading(true);
        await maybePromise;
        setLoading(false);
      } catch (err) {
        setLoading(false);
        throw err;
      }
    }

    handleClose();
  };

  return (
    <Modal onClose={handleClose} open={open}>
      <ModalDialog
        color={color}
        layout={layout}
        variant={variant}
        maxWidth={500}
        // role="alertdialog"
      >
        <DialogTitle>
          <WarningRoundedIcon />
          {dialogTitle}
        </DialogTitle>

        <Divider />

        <DialogContent>{message}</DialogContent>

        <DialogActions>
          <Button
            color={cancelButtonColor}
            onClick={handleClose}
            variant={cancelButtonVariant}
          >
            {cancelText}
          </Button>

          <Button
            color={confirmButtonColor}
            loading={loading}
            loadingPosition="start"
            onClick={handleConfirm}
            variant={loading ? "outlined" : confirmButtonVariant}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
