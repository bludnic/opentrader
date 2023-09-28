import { SxProps, Theme } from "@mui/material";
import { TextField } from "mui-rff";
import React, { FC } from "react";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

type AccountNameFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateExchangeAccountFormValues = "name";

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
