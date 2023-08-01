import React, { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { MenuItem, TextFieldProps as MuiTextFieldProps } from "@mui/material";

import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { setExchangeAccountId } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectExchangeAccountId } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { selectExchangeAccounts } from "src/store/exchange-accounts/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { rtkApi } from "src/lib/bifrost/rtkApi";

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
  const { data } = useAppSelector(rtkApi.endpoints.getAccounts.select());

  const value = useAppSelector(selectExchangeAccountId);
  const handleChange = (e: SelectChangeEvent<ExchangeAccountDto["id"]>) => {
    dispatch(setExchangeAccountId(e.target.value));
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
        {data?.exchangeAccounts.map((account) => (
          <MenuItem value={account.id} key={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
