import clsx from "clsx";
import TextField from "@mui/material/TextField";
import Autocomplete, {
  autocompleteClasses,
  AutocompleteProps,
} from "@mui/material/Autocomplete";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { CoinsListReply } from "src/lib/coingecko/client";
import { VariableSizeListboxComponent } from "src/components/ui/CoinsListCombobox/VariableSizeList";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const componentName = "CoinsCombobox";
const classes = {
  root: `${componentName}-root`,
};

type TypedAutocompleteProps = AutocompleteProps<
  CoinsListReply,
  undefined,
  undefined,
  false
>;

const StyledAutocomplete = styled(Autocomplete as FC<TypedAutocompleteProps>)(
  ({ theme }) => ({
    /* Styles applied to the root element. */
    [`& .${classes.root}`]: {},
  })
);

export type CoinsComboboxProps = {
  coins: CoinsListReply[];
  className?: string;
  AutocompleteProps?: TypedAutocompleteProps;
};

export const CoinsCombobox: FC<CoinsComboboxProps> = (props) => {
  const { className, coins, AutocompleteProps } = props;

  return (
    <StyledAutocomplete
      className={clsx(classes.root, className)}
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={VariableSizeListboxComponent}
      options={coins}
      renderInput={(params) => <TextField {...params} label="Coins list" />}
      renderOption={(props, option) => [props, option]}
      renderGroup={(params) => params}
      getOptionLabel={(option) => option.symbol || ""}
      sx={{ width: 300 }}
      {...AutocompleteProps}
    />
  );
};

CoinsCombobox.displayName = componentName;
