import React, { FC, useState } from "react";
import { TextField } from "@mui/material";
import { updateGridLineQuantity } from 'src/sections/grid-bot/create-bot/store/bot-form';
import { selectGridLine } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type GridLineQuantityFieldProps = {
  gridLineIndex: number;
  disabled?: boolean;
  className?: string;
};

export const GridLineQuantityField: FC<GridLineQuantityFieldProps> = (props) => {
  const { className, gridLineIndex, disabled } = props;

  const dispatch = useAppDispatch();

  const { quantity: reduxValue } = useAppSelector(selectGridLine(gridLineIndex));
  const [value, setValue] = useState(reduxValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleBlur = () => {
    if (!Number.isNaN(value)) {
      dispatch(
        updateGridLineQuantity({
          gridLineIndex,
          quantity: value,
        })
      );
    } else {
      setValue(reduxValue);
    }
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      label="Quantity"
      type="number"
      fullWidth
      disabled={disabled}
      size="small"
    />
  );
};
