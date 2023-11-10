"use client";

import { createContext } from "react";
import { TRPCApiError } from "src/ui/errors/types";

export type State = {
  error: TRPCApiError | null;
  showErrorModal: (error: TRPCApiError) => void;
  close: () => void;
};

const defaultState: State = {
  error: null,
  showErrorModal: () => void 0,
  close: () => void 0,
};

export const TRPCApiContext = createContext(defaultState);
