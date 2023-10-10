import { AutocompleteProps } from "@mui/joy/Autocomplete";
import { TSymbol } from "src/types/trpc";

export type TypedAutocompleteProps = AutocompleteProps<
  TSymbol,
  undefined,
  undefined,
  false
>;
