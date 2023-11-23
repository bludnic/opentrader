import { useContext } from "react";
import { SnackbarContext } from "./context";

export function useSnackbar() {
  return useContext(SnackbarContext);
}
