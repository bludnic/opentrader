import React, { FC, useEffect, useState } from 'react';
import { TextField } from "@mui/material";
import { changeHighPrice } from 'src/sections/grid-bot/create-bot/store/bot-form';
import { selectHighPrice } from 'src/sections/grid-bot/create-bot/store/bot-form/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

type HighPriceFieldProps = {
  className?: string;
};

export const HighPriceField: FC<HighPriceFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectHighPrice);
  const [value, setValue] = useState(reduxValue);

  useEffect(() => {
    setValue(reduxValue);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleBlur = () => {
    if (Number.isInteger(value)) {
      dispatch(changeHighPrice(value));
    } else {
      setValue(reduxValue)
    }
  }

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      label="High price"
      type="number"
      fullWidth
    />
  );
};
