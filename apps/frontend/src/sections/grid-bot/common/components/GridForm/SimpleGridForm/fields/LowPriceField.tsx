import React, { FC, useEffect, useState } from "react";
import { PriceInput } from "src/components/ui/PriceInput";
import { changeLowPrice } from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectCurrencyPair,
  selectLowPrice,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";

type LowPriceFieldProps = {
  className?: string;
};

export const LowPriceField: FC<LowPriceFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const currencyPair = useAppSelector(selectCurrencyPair);
  const symbol = useAppSelector(selectSymbolById(currencyPair));

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
      className={className}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Low price"
      fullWidth
      filter={symbol.filters}
    />
  );
};
