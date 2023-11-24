"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { PriceInput } from "src/ui/inputs/PriceInput";
import { tClient } from "src/lib/trpc/client";
import { changeHighPrice } from "src/store/bot-form";
import { selectHighPrice, selectSymbolId } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type HighPriceFieldProps = {
  disabled?: boolean;
  readOnly?: boolean;
};

export const HighPriceField: FC<HighPriceFieldProps> = (props) => {
  const { disabled, readOnly } = props;

  const symbolId = useAppSelector(selectSymbolId);
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({ symbolId });

  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectHighPrice);
  const [value, setValue] = useState(`${reduxValue}`);

  useEffect(() => {
    setValue(`${reduxValue}`);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (value.length > 0) {
      dispatch(changeHighPrice(Number(value)));
    } else {
      setValue(`${reduxValue}`);
    }
  };

  return (
    <PriceInput
      disabled={disabled}
      filter={symbol.filters}
      fullWidth
      label="High price"
      onBlur={handleBlur}
      onChange={handleChange}
      readOnly={readOnly}
      value={value}
    />
  );
};
