"use client";

import React, { FC, useState } from "react";
import Typography from "@mui/joy/Typography";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import { ExchangeIcon } from "src/ui/icons/ExchangeIcon";
import { tClient } from "src/lib/trpc/client";
import { TExchangeAccount } from "src/types/trpc";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";

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
      inputValue={inputValue}
      onInputChange={(_e, value) => setInputValue(value)}
      value={value || undefined}
      onChange={(e, value) => onChange(value)}
      options={data}
      autoHighlight
      getOptionLabel={getOptionLabel}
      disableClearable
      isOptionEqualToValue={(option) =>
        value ? value.id === option.id : false
      }
      renderOption={(props, option) => (
        <AutocompleteOption {...props} key={option.id}>
          <ListItemDecorator>
            <ExchangeIcon
              size={64}
              exchangeCode={option.exchangeCode}
              width={20}
              height={20}
            />
          </ListItemDecorator>
          <ListItemContent sx={{ fontSize: "sm" }}>
            {option.exchangeCode}
            <Typography level="body-xs">{option.name}</Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
};

ExchangeAccountSelect.displayName = "ExchangeAccountSelect";
