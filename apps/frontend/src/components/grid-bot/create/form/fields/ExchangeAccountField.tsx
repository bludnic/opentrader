"use client";

import React, { FC } from "react";
import { TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { ExchangeAccountSelect } from "src/components/joy/ui/ExchangeAccountSelect";
import { tClient } from "src/lib/trpc/client";

import {
  setExchangeAccountId,
  setExchangeCode,
} from "src/sections/grid-bot/create-bot/store/bot-form";
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
  const [exchangeAccounts] = tClient.exchangeAccount.list.useSuspenseQuery();

  const id = useAppSelector(selectExchangeAccountId);
  const handleIdChange = (exchange: TExchangeAccount | null) => {
    if (exchange === null) {
      throw new Error(
        "ExchangeAccountField: Cannot reset exchange account input",
      );
    }

    dispatch(setExchangeAccountId(exchange.id));
    dispatch(setExchangeCode(exchange.exchangeCode));
  };

  const exchange = exchangeAccounts.find((exchange) => exchange.id === id);

  return <ExchangeAccountSelect value={exchange!} onChange={handleIdChange} />;
};
