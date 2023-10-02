import { AutocompleteProps } from "@mui/material/Autocomplete";
import { TSymbol } from "src/types/trpc";

export type TypedAutocompleteProps = AutocompleteProps<
  TSymbol,
  undefined,
  undefined,
  false
>;
