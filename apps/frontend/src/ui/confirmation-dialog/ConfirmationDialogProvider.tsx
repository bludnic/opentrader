"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ConfirmationDialog } from "src/ui/confirmation-dialog/ConfirmationDialog";
import type { ConfirmationDialogOptions, State } from "./context";
import { defaultState, ConfirmationDialogContext } from "./context";

type ConfirmationDialogProviderProps = {
  children: ReactNode;
};

export const ConfirmationDialogProvider: FC<
  ConfirmationDialogProviderProps
> = ({ children }) => {
  const handleClose = () => {
    setState({
      ...defaultState,
      open: false,
      showConfirmDialog,
      handleClose,
    });
  };

  const showConfirmDialog = (
    message: ReactNode,
    onConfirm: () => void,
    options?: ConfirmationDialogOptions,
  ) => {
    setState({
      ...defaultState,
      ...options,
      open: true,
      showConfirmDialog,
      handleClose,
      onConfirm,
      message,
    });
  };

  const [state, setState] = useState<State>({
    ...defaultState,
    showConfirmDialog,
    handleClose,
  });

  return (
    <ConfirmationDialogContext.Provider value={state}>
      {children}

      <ConfirmationDialog />
    </ConfirmationDialogContext.Provider>
  );
};
