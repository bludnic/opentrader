"use client";

import React, { FC, useEffect, useState } from "react";
import { QuantityInput } from "src/components/joy/ui/QuantityInput";
import { tClient } from "src/lib/trpc/client";
import { updateGridLineQuantity } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectGridLine, selectSymbolId } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type GridLineQuantityFieldProps = {
  gridLineIndex: number;
  disabled?: boolean;
  className?: string;
};

export const GridLineQuantityField: FC<GridLineQuantityFieldProps> = (
  props,
) => {
  const { className, gridLineIndex, disabled } = props;

  const dispatch = useAppDispatch();

  const symbolId = useAppSelector(selectSymbolId);
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({
    symbolId,
  });


  const { quantity: reduxValue } = useAppSelector(
    selectGridLine(gridLineIndex),
  );
  const [value, setValue] = useState(`${reduxValue}`);
  useEffect(() => {
    setValue(`${reduxValue}`);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (!isNaN(Number(value))) {
      dispatch(
        updateGridLineQuantity({
          gridLineIndex,
          quantity: Number(value),
        }),
      );
    } else {
      setValue(`${reduxValue}`);
    }
  };

  return (
    <QuantityInput
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      label="Quantity"
      fullWidth
      disabled={disabled}
      size="sm"
      filter={symbol.filters}
    />
  );
};
