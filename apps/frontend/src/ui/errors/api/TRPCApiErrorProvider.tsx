"use client";

import { FC, ReactNode, useState } from "react";
import { TRPCApiError } from "src/ui/errors/types";
import { TRPCApiContext, State } from "./context";
import { TRPCApiErrorModal } from "src/ui/errors/api/TRPCApiErrorModal";

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
