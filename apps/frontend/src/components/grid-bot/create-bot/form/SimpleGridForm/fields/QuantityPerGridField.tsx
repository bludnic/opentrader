"use client";

import React, { FC, useEffect, useState } from "react";
import { tClient } from "src/lib/trpc/client";
import { changeQuantityPerGrid } from "src/store/bot-form";
import {
  selectQuantityPerGrid,
  selectSymbolId,
} from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { QuantityInput } from "src/ui/inputs/QuantityInput";

type QuantityPerGridFieldProps = {
  disabled?: boolean;
  readOnly?: boolean;
};

export const QuantityPerGridField: FC<QuantityPerGridFieldProps> = (props) => {
  const { disabled, readOnly } = props;
  const symbolId = useAppSelector(selectSymbolId);
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({ symbolId });

  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectQuantityPerGrid);
  const [value, setValue] = useState(reduxValue);

  useEffect(() => {
    setValue(reduxValue);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (!isNaN(Number(value))) {
      dispatch(changeQuantityPerGrid(value));
    } else {
      setValue(`${reduxValue}`);
    }
  };

  return (
    <QuantityInput
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Quantity per grid"
      required
      fullWidth
      filter={symbol.filters}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};
