import React, { FC } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input, { InputProps } from "@mui/joy/Input";

type AccountIdFieldProps = {
  disabled?: boolean;
  value: number;
};

export const AccountIdField: FC<AccountIdFieldProps> = (props) => {
  const { disabled, value } = props;

  return (
    <FormControl>
      <FormLabel>Account ID</FormLabel>

      <Input value={value} disabled={disabled} autoComplete="off" />
    </FormControl>
  );
};
