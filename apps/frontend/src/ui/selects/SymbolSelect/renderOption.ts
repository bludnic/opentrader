import type { TypedAutocompleteProps } from "./types";

export type RenderOptionParams = Parameters<
  NonNullable<TypedAutocompleteProps["renderOption"]>
>;

export type RenderOptionsResult = RenderOptionParams;

export function renderOption(
  ...params: RenderOptionParams
): RenderOptionsResult {
  return params;
}
