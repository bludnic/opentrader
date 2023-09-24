import React, { FC, useEffect, useState } from "react";
import { PriceInput } from "src/components/ui/PriceInput";
import { useSymbol } from "src/sections/grid-bot/create-bot/hooks/useSymbol";
import { changeHighPrice } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectHighPrice } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type HighPriceFieldProps = {
  className?: string;
};

export const HighPriceField: FC<HighPriceFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const symbol = useSymbol();

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
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      label="High price"
      fullWidth
      filter={symbol.filters}
    />
  );
};
