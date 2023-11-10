import { useContext } from "react";
import { TRPCApiContext } from "./context";

export function useTRPCErrorModal() {
  return useContext(TRPCApiContext);
}
