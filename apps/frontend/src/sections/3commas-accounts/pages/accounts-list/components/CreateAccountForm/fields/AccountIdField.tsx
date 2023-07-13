import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { TextField } from "mui-rff";
import React, { FC } from "react";
import { CreateAccountFormValues } from "src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/types";

type AccountIdFieldProps = {
  className?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  value?: string;
};

const fieldName: keyof CreateAccountFormValues = "id";

export const AccountIdField: FC<AccountIdFieldProps> = (props) => {
  const { sx, className, disabled, value } = props;

  return (
    <TextField
      className={className}
      label="Account ID"
      name={fieldName}
      sx={sx}
      required
      value={value}
      disabled={disabled}
      autoComplete="off"
    />
  );
};
