import type { FC } from "react";
import React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

type AccountIdFieldProps = {
  disabled?: boolean;
  value: number;
};

export const AccountIdField: FC<AccountIdFieldProps> = (props) => {
  const { disabled, value } = props;

  return (
    <FormControl>
      <FormLabel>Account ID</FormLabel>

      <Input autoComplete="off" disabled={disabled} value={value} />
    </FormControl>
  );
};
