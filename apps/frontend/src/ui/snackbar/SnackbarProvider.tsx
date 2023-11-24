"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Snackbar } from "./Snackbar";
import type { SnackbarOptions, State } from "./context";
import { defaultOptions, SnackbarContext } from "./context";

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider: FC<SnackbarProviderProps> = ({ children }) => {
  const handleClose = () => {
    setState({
      open: false,
      showSnackbar,
      handleClose,
      message: state.message,
      ...defaultOptions,
    });
  };

  const showSnackbar = (message: string, options?: SnackbarOptions) => {
    setState({
      open: true,
      showSnackbar,
      handleClose,
      message,
      ...defaultOptions,
      ...options,
    });
  };

  const [state, setState] = useState<State>({
    open: false,
    showSnackbar,
    handleClose,
    message: "",
    ...defaultOptions,
  });

  return (
    <SnackbarContext.Provider value={state}>
      {children}

      <Snackbar />
    </SnackbarContext.Provider>
  );
};
