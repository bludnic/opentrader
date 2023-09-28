import React, { FC, useState } from "react";
import { TextField } from "@mui/material";
import { changeGridLinesNumber } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectGridLinesNumber } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type GridStepFieldProps = {
  className?: string;
};

export const GridLevelsField: FC<GridStepFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectGridLinesNumber);
  const [value, setValue] = useState(reduxValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleBlur = () => {
    if (Number.isInteger(value)) {
      dispatch(changeGridLinesNumber(value));
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
      label="Grid levels"
      required={true}
      type="number"
      fullWidth
    />
  );
};
