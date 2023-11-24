import type { FC } from "react";
import React, { useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { changeGridLinesNumber } from "src/store/bot-form";
import { selectGridLinesNumber } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type GridLevelsFieldProps = {
  disabled?: boolean;
  readOnly?: boolean;
};

const fieldName = "gridLevels" as const;

export const GridLevelsField: FC<GridLevelsFieldProps> = (props) => {
  const { disabled, readOnly } = props;
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
      setValue(reduxValue);
    }
  };

  return (
    <FormControl>
      <FormLabel>Grid levels</FormLabel>

      <Input
        autoComplete="off"
        disabled={disabled}
        name={fieldName}
        onBlur={handleBlur}
        onChange={handleChange}
        readOnly={readOnly}
        required
        type="number"
        value={value}
      />
    </FormControl>
  );
};
