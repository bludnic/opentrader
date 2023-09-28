import { SxProps, Theme } from "@mui/material";
import { Checkboxes } from "mui-rff";
import React, { FC } from "react";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

type IsDemoAccountFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateExchangeAccountFormValues = "isDemoAccount";

export const IsDemoAccountField: FC<IsDemoAccountFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <Checkboxes
      className={className}
      data={{
        label: "Is Demo Account?",
        value: false,
      }}
      name={fieldName}
      required
      sx={sx}
    />
  );
};
