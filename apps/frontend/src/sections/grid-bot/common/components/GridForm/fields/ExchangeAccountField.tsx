import React, { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { MenuItem, TextFieldProps as MuiTextFieldProps } from "@mui/material";

import { useExchangeAccounts } from "src/sections/grid-bot/create-bot/hooks/useExchangeAccounts";
import { setExchangeAccountId } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectExchangeAccountId } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { TExchangeAccount } from "src/types/trpc";

export type ExchangeFieldProps = Partial<
  Omit<MuiTextFieldProps, "type" | "onChange">
> & {
  className?: string;
};

export const ExchangeAccountField: FC<ExchangeFieldProps> = (props) => {
  const { className } = props;

  const labelText = "Exchange";
  const labelId = "exchange-id";

  const dispatch = useAppDispatch();
  const exchangeAccounts = useExchangeAccounts();

  const value = useAppSelector(selectExchangeAccountId);
  const handleChange = (e: SelectChangeEvent<TExchangeAccount["id"]>) => {
    dispatch(setExchangeAccountId(e.target.value as number)); // @todo fix number type
  };

  return (
    <FormControl className={className} required fullWidth>
      <InputLabel id={labelId}>{labelText}</InputLabel>

      <Select
        label={labelText}
        labelId={labelId}
        value={value}
        onChange={handleChange}
      >
        {exchangeAccounts.map((account) => (
          <MenuItem value={account.id} key={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
