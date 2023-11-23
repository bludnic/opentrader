"use client";

import MuiSnackbar from "@mui/joy/Snackbar";
import Alert from "@mui/joy/Alert";
import { FC } from "react";
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
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      sx={{
        padding: 0,
      }}
    >
      <Alert color={color} variant={variant} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};
