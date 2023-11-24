"use client";

import type { FC } from "react";
import React, { useState } from "react";
import Typography from "@mui/joy/Typography";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import { ExchangeIcon } from "src/ui/icons/ExchangeIcon";
import { tClient } from "src/lib/trpc/client";
import type { TExchangeAccount } from "src/types/trpc";

export type ExchangeAccountSelectProps = {
  value: TExchangeAccount | null;
  onChange: (value: TExchangeAccount | null) => void;
  defaultExchangeAccounts?: TExchangeAccount[];
};

const getOptionLabel = (exchangeAccount: TExchangeAccount) =>
  exchangeAccount.name;

export const ExchangeAccountSelect: FC<ExchangeAccountSelectProps> = ({
  value,
  onChange,
  defaultExchangeAccounts,
}) => {
  const [inputValue, setInputValue] = useState(
    value ? getOptionLabel(value) : "",
  );

  const [data] = defaultExchangeAccounts
    ? [defaultExchangeAccounts]
    : tClient.exchangeAccount.list.useSuspenseQuery();

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      getOptionLabel={getOptionLabel}
      inputValue={inputValue}
      isOptionEqualToValue={(option) =>
        value ? value.id === option.id : false
      }
      onChange={(e, value) => {
        onChange(value);
      }}
      onInputChange={(_e, value) => {
        setInputValue(value);
      }}
      options={data}
      renderOption={(props, option) => (
        <AutocompleteOption {...props} key={option.id}>
          <ListItemDecorator>
            <ExchangeIcon
              exchangeCode={option.exchangeCode}
              height={20}
              size={64}
              width={20}
            />
          </ListItemDecorator>
          <ListItemContent sx={{ fontSize: "sm" }}>
            {option.exchangeCode}
            <Typography level="body-xs">{option.name}</Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
      value={value || undefined}
    />
  );
};

ExchangeAccountSelect.displayName = "ExchangeAccountSelect";
