"use client";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import React, { FC } from "react";

type SettingInputProps = {
  label: string;
  value: number;
};

export const SettingInput: FC<SettingInputProps> = ({ value, label }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>

    <Input value={value} readOnly />
  </FormControl>
);
