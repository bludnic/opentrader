import { ExchangeCode } from "@bifrost/types";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import Autocomplete, {
  autocompleteClasses,
  AutocompleteProps,
} from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC, ReactNode } from "react";
import { renderOption } from "src/components/ui/CryptoCoinSelector/renderOption";
import { VariableSizeListboxComponent } from "./VariableSizeList";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TExchangeCode, TSymbol } from "src/types/trpc";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const componentName = "CryptoCoinSelector" as const;
const classes = {
  root: `${componentName}-root`,
};

type TypedAutocompleteProps = AutocompleteProps<
  TSymbol,
  undefined,
  undefined,
  false
>;

const StyledAutocomplete = styled(Autocomplete as FC<TypedAutocompleteProps>)(
  ({ theme }) => ({
    /* Styles applied to the root element. */
    [`&.${classes.root}`]: {},
  }),
);

export type CryptoCoinSelectorProps = {
  className?: string;
  exchangeCode: TExchangeCode;
  value: TSymbol | null;
  onChange: (value: TSymbol | null) => void;
};

export const CryptoCoinSelector: FC<CryptoCoinSelectorProps> = ({
  className,
  exchangeCode,
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } = trpcApi.symbol.list.useQuery({
    input: exchangeCode as ExchangeCode, // @todo tRPC: change enum to string literal on backend API
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>An error happened: {JSON.stringify(error)}</>;
  }

  return (
    <StyledAutocomplete
      className={clsx(classes.root, className)}
      value={value}
      onChange={(e, value) => onChange(value)}
      sx={{ width: 300 }}
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={VariableSizeListboxComponent}
      options={data}
      autoHighlight
      getOptionLabel={(option) => option.symbolId}
      // Actually it doesn't return ReactNode, but an array
      // with: option's `HTMLElement`, option data, `state` and `ownerState`.
      // Check `renderOption()` params for more details.
      // To make TS happy the return type will be marked as ReactNode.
      renderOption={(...props) => renderOption(...props) as ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose coin"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

CryptoCoinSelector.displayName = componentName;
