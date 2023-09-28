import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { FC } from "react";
import {
  changeFormType,
  GridBotFormType,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectFormType } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type FormTypeFieldProps = {
  className?: string;
};

export const FormTypeField: FC<FormTypeFieldProps> = (props) => {
  const { className } = props;
  const formType = useAppSelector(selectFormType);
  const dispatch = useAppDispatch();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: GridBotFormType
  ) => {
    // disallow un-toggling current button
    if (newValue === null) return;

    dispatch(changeFormType(newValue));
  };

  return (
    <ToggleButtonGroup
      className={className}
      color="primary"
      value={formType}
      exclusive
      onChange={handleChange}
      size="small"
    >
      {/* @todo enum */}
      <ToggleButton value="simple">Simple form</ToggleButton>
      <ToggleButton value="advanced">Advanced form</ToggleButton>
    </ToggleButtonGroup>
  );
};
