import React, { FC } from "react";
import Typography from "@mui/joy/Typography";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import { ExchangeIcon } from "./ExchangeIcon";
import { tClient } from "src/lib/trpc/client";
import { TExchangeAccount } from "src/types/trpc";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";

export type ExchangeAccountSelectProps = {
  value: TExchangeAccount | null;
  onChange: (value: TExchangeAccount | null) => void;
};

export const ExchangeAccountSelect: FC<ExchangeAccountSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } =
    tClient.exchangeAccount.list.useQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>An error happened: {JSON.stringify(error)}</>;
  }

  return (
    <Autocomplete
      value={value || undefined}
      onChange={(e, value) => onChange(value)}
      options={data}
      autoHighlight
      getOptionLabel={(option) => option.name}
      disableClearable
      renderOption={(props, option) => (
        <AutocompleteOption {...props}>
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
