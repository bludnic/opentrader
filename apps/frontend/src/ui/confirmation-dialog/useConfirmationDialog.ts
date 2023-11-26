import { useContext } from "react";
import { ConfirmationDialogContext } from "./context";

export function useConfirmationDialog() {
  return useContext(ConfirmationDialogContext);
}
