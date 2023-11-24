"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import type { TRPCApiError } from "src/ui/errors/types";
import { TRPCApiErrorModal } from "src/ui/errors/api/TRPCApiErrorModal";
import type { State } from "./context";
import { TRPCApiContext } from "./context";

type TRPCApiErrorProviderProps = {
  children: ReactNode;
};

export const TRPCApiErrorProvider: FC<TRPCApiErrorProviderProps> = ({
  children,
}) => {
  const close = () => {
    setState({
      error: null,
      showErrorModal,
      close,
    });
  };

  const showErrorModal = (error: TRPCApiError) => {
    setState({
      error,
      showErrorModal,
      close,
    });
  };

  const [state, setState] = useState<State>({
    error: null,
    showErrorModal,
    close,
  });

  return (
    <TRPCApiContext.Provider value={state}>
      {children}

      <TRPCApiErrorModal />
    </TRPCApiContext.Provider>
  );
};
