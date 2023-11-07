"use client";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import React, { FC, useEffect, useState } from "react";
import { changeBotName } from "src/store/bot-form";
import { selectBotName } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export const BotNameField: FC = () => {
  const dispatch = useAppDispatch();

  const reduxValue = useAppSelector(selectBotName);
  const [value, setValue] = useState(reduxValue);
  useEffect(() => {
    setValue(`${reduxValue}`);
  }, [reduxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (value.length > 0) {
      dispatch(changeBotName(value));
    } else {
      setValue(reduxValue);
    }
  };

  const errorMessage = value.length === 0 ? "Must be defined" : null;

  return (
    <FormControl error={!!errorMessage}>
      <FormLabel>Bot name</FormLabel>

      <Input value={value} onChange={handleChange} onBlur={handleBlur} />

      {errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null}
    </FormControl>
  );
};
