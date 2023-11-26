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
import { useConfirmationDialog } from "./useConfirmationDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

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
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        color={color}
        variant={variant}
        layout={layout}
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
            variant={cancelButtonVariant}
            color={cancelButtonColor}
            onClick={handleClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={loading ? "outlined" : confirmButtonVariant}
            color={confirmButtonColor}
            onClick={handleConfirm}
            loading={loading}
            loadingPosition="start"
          >
            {confirmText}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
