"use client";

import { createContext } from "react";
import type { ModalDialogProps } from "@mui/joy/ModalDialog";
import { ButtonProps } from "@mui/joy/Button";

export type ConfirmationDialogOptions = {
  /**
   * Default to `"neutral"`
   */
  color?: ModalDialogProps["color"];
  /**
   * Default to `"outlined"`
   */
  variant?: ModalDialogProps["variant"];
  /**
   * Default to `"center"`
   */
  layout?: ModalDialogProps["layout"];

  /**
   * Default to "Confirmation"
   */
  dialogTitle?: string;

  /**
   * Confirm button text.
   * Default to `"Confirm"`
   */
  confirmText?: string;
  /**
   * Confirm button color.
   * Default to `"primary"`
   */
  confirmButtonColor?: ButtonProps["color"];
  /**
   * Confirm button variant.
   * Default to `"solid"`
   */
  confirmButtonVariant?: ButtonProps["variant"];

  /**
   * Cancel button text.
   * Default to "Cancel"
   */
  cancelText?: string;
  /**
   * Cancel button color.
   * Default to `"neutral"`
   */
  cancelButtonColor?: ButtonProps["color"];
  /**
   * Cancel button variant.
   * Default to `"outlined"`
   */
  cancelButtonVariant?: ButtonProps["variant"];
};

const defaultOptions: Required<ConfirmationDialogOptions> = {
  color: "neutral",
  variant: "outlined",
  layout: "center",
  dialogTitle: "Confirmation",
  confirmText: "Confirm",
  confirmButtonColor: "primary",
  confirmButtonVariant: "solid",
  cancelText: "Cancel",
  cancelButtonColor: "neutral",
  cancelButtonVariant: "outlined",
};

export type State = {
  open: boolean;
  showConfirmDialog: (
    message: string,
    onConfirm: () => void,
    options?: ConfirmationDialogOptions,
  ) => void;
  handleClose: () => void;
  onConfirm: () => Promise<unknown> | unknown;
  message: string;
} & Required<ConfirmationDialogOptions>;

export const defaultState: State = {
  open: false,
  showConfirmDialog: () => void 0,
  handleClose: () => void 0,
  onConfirm: () => void 0,
  message: "",
  ...defaultOptions,
};

export const ConfirmationDialogContext = createContext(defaultState);
