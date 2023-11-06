import React, { FC, useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { changeGridLinesNumber } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectGridLinesNumber } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
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
        name={fieldName}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        autoComplete="off"
        type="number"
        disabled={disabled}
        readOnly={readOnly}
      />
    </FormControl>
  );
};
