"use client";

import React, { FC, useEffect, useState } from "react";
import { PriceInput } from "src/components/joy/ui/PriceInput";
import { useIsStale } from "src/hooks/useIsStale";
import { tClient } from "src/lib/trpc/client";
import {
  changeLowPrice,
  setHighPrice,
  setLowPrice,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectLowPrice,
  selectSymbolId,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { TSymbol } from "src/types/trpc";

type LowPriceFieldProps = {
  disabled?: boolean;
  readOnly?: boolean;
};

export const LowPriceField: FC<LowPriceFieldProps> = (props) => {
  const { disabled, readOnly } = props;
  const symbolId = useAppSelector(selectSymbolId);
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({ symbolId });

  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectLowPrice);
  const [value, setValue] = useState(`${reduxValue}`);

  useEffect(() => {
    setValue(`${reduxValue}`);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (value.length > 0) {
      dispatch(changeLowPrice(Number(value)));
    } else {
      setValue(`${reduxValue}`);
    }
  };

  return (
    <PriceInput
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Low price"
      fullWidth
      filter={symbol.filters}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};
