"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { QuantityInput } from "src/ui/inputs/QuantityInput";
import { tClient } from "src/lib/trpc/client";
import { updateGridLineQuantity } from "src/store/bot-form";
import { selectGridLine, selectSymbolId } from "src/store/bot-form/selectors";
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
      className={className}
      disabled={disabled}
      filter={symbol.filters}
      fullWidth
      label="Quantity"
      onBlur={handleBlur}
      onChange={handleChange}
      size="sm"
      value={value}
    />
  );
};
