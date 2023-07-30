import React, { FC, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { changeQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type QuantityPerGridFieldProps = {
  className?: string;
};

export const QuantityPerGridField: FC<QuantityPerGridFieldProps> = (props) => {
  const { className } = props;

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
    <TextField
      className={className}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Quantity per grid"
      required={true}
      fullWidth
    />
  );
};
