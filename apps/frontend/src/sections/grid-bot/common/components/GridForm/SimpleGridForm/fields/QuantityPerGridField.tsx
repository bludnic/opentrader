import React, { FC, useEffect, useState } from "react";
import { useSymbol } from "src/sections/grid-bot/create-bot/hooks/useSymbol";
import { changeQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { QuantityInput } from "src/components/ui/QuantityInput";

type QuantityPerGridFieldProps = {
  className?: string;
};

export const QuantityPerGridField: FC<QuantityPerGridFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const symbol = useSymbol();

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
      className={className}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Quantity per grid"
      required
      fullWidth
      filter={symbol.filters}
    />
  );
};
