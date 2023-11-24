"use client";

import type { FC } from "react";
import React from "react";
import { ExchangeAccountSelect } from "src/ui/selects/ExchangeAccountSelect";
import { tClient } from "src/lib/trpc/client";
import { setExchangeAccountId, setExchangeCode } from "src/store/bot-form";
import { selectExchangeAccountId } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import type { TExchangeAccount } from "src/types/trpc";

export const ExchangeAccountField: FC = () => {
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

  const selectedExchange = exchangeAccounts.find(
    (exchange) => exchange.id === id,
  );

  return (
    <ExchangeAccountSelect
      onChange={handleIdChange}
      value={selectedExchange!}
    />
  );
};
