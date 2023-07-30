import React, { FC, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { changeLowPrice } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectLowPrice } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type LowPriceFieldProps = {
  className?: string;
};

export const LowPriceField: FC<LowPriceFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectLowPrice);
  const [value, setValue] = useState(reduxValue);

  useEffect(() => {
    setValue(reduxValue);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleBlur = () => {
    if (Number.isInteger(value)) {
      dispatch(changeLowPrice(value));
    } else {
      setValue(reduxValue);
    }
  };

  return (
    <TextField
      className={className}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Low price"
      type="number"
      fullWidth
    />
  );
};
