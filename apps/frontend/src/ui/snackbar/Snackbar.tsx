"use client";

import MuiSnackbar from "@mui/joy/Snackbar";
import Alert from "@mui/joy/Alert";
import type { FC } from "react";
import { useSnackbar } from "src/ui/snackbar/useSnackbar";

export const Snackbar: FC = () => {
  const {
    open,
    handleClose,
    message,
    color,
    variant,
    autoHideDuration,
    anchorOrigin,
  } = useSnackbar();

  return (
    <MuiSnackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      open={open}
      sx={{
        padding: 0,
      }}
    >
      <Alert color={color} sx={{ width: "100%" }} variant={variant}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};
