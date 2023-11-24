"use client";

import { createContext } from "react";
import type { SnackbarProps } from "@mui/joy/Snackbar";
import type { AlertProps } from "@mui/joy/Alert";

export type SnackbarOptions = {
  /**
   * Default to `"success"`
   */
  color?: AlertProps["color"];
  /**
   * Default to `"solid"`
   */
  variant?: AlertProps["variant"];
  /**
   * Default to `2000` ms
   */
  autoHideDuration?: number;
  /**
   * Default to `{ vertical: 'bottom', horizontal: 'left' }`
   */
  anchorOrigin?: SnackbarProps["anchorOrigin"];
};

export const defaultOptions: Required<SnackbarOptions> = {
  color: "success",
  variant: "solid",
  autoHideDuration: 2000,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
};

export type State = {
  open: boolean;
  showSnackbar: (message: string, options?: SnackbarOptions) => void;
  handleClose: () => void;
  message: string;
} & Required<SnackbarOptions>;

const defaultState: State = {
  open: false,
  showSnackbar: () => void 0,
  handleClose: () => void 0,
  message: "",
  ...defaultOptions,
};

export const SnackbarContext = createContext(defaultState);
