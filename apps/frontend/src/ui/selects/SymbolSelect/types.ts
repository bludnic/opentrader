import type { AutocompleteProps } from "@mui/joy/Autocomplete";
import type { TSymbol } from "src/types/trpc";

export type TypedAutocompleteProps = AutocompleteProps<
  TSymbol,
  undefined,
  undefined,
  false
>;
