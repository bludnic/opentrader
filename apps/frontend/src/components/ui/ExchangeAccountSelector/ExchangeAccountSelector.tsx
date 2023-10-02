import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC } from "react";
import { ExchangeIcon } from "src/components/ui/ExchangeIcon";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TExchangeAccount } from "src/types/trpc";

const componentName = "ExchangeAccountSelector" as const;
const classes = {
  root: `${componentName}-root`,
};

type TypedAutocompleteProps = AutocompleteProps<
  TExchangeAccount,
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

export type ExchangeAccountSelectorProps = {
  className?: string;
  value: TExchangeAccount | null;
  onChange: (value: TExchangeAccount | null) => void;
};

export const ExchangeAccountSelector: FC<ExchangeAccountSelectorProps> = ({
  className,
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } =
    trpcApi.exchangeAccount.list.useQuery();

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
      options={data}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <ExchangeIcon
            size={64}
            exchangeCode={option.exchangeCode}
            width={20}
            height={20}
          />
          <Typography variant="body1">{option.exchangeCode}</Typography>
          <div>&nbsp;</div>
          <Typography variant="body2" color="text.secondary">
            {option.name}
          </Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose an exchange account"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

ExchangeAccountSelector.displayName = componentName;
