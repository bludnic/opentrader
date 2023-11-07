"use client";

import React, { FC, useEffect, useState } from "react";
import { PriceInput } from "src/ui/inputs/PriceInput";
import { tClient } from "src/lib/trpc/client";
import { updateGridLinePrice } from "src/store/bot-form";
import { selectGridLine, selectSymbolId } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type GridLinePriceFieldProps = {
  gridLineIndex: number;
  className?: string;
};

export const GridLinePriceField: FC<GridLinePriceFieldProps> = (props) => {
  const { className, gridLineIndex } = props;

  const dispatch = useAppDispatch();

  const { price: reduxValue } = useAppSelector(selectGridLine(gridLineIndex));
  const [value, setValue] = useState<string>(String(reduxValue));
  useEffect(() => {
    setValue(`${reduxValue}`);
  }, [reduxValue]);

  const symbolId = useAppSelector(selectSymbolId);
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({
    symbolId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (value.length > 0) {
      dispatch(
        updateGridLinePrice({
          gridLineIndex,
          price: Number(value),
        }),
      );
    } else {
      setValue(String(reduxValue));
    }
  };

  return (
    <PriceInput
      value={value} // @todo fix type
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      label="Price"
      fullWidth
      filter={symbol.filters}
      size="sm"
    />
  );
};
