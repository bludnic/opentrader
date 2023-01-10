import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { TextField } from "mui-rff";
import React, { FC } from "react";
import { CreateAccountFormValues } from "src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/types";

type AccountNameFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateAccountFormValues = "name";

export const AccountNameField: FC<AccountNameFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <TextField
      className={className}
      label="Account name"
      name={fieldName}
      sx={sx}
      required
      autoComplete="off"
    />
  );
};
